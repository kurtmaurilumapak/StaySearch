import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useMessageStore = defineStore('message', {
  state: () => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    unreadCount: 0,
    loading: false,
    realtimeChannel: null
  }),

  actions: {
    // Fetch all conversations for the current user
    async fetchConversations(userId, userRole) {
      this.loading = true
      try {
        const column = userRole === 'student' ? 'student_id' : 'owner_id'

        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq(column, userId)
          .order('last_message_at', { ascending: false })

        if (error) throw error

        // Fetch related user and boarding house data
        if (data && data.length > 0) {
          const studentIds = [...new Set(data.map(c => c.student_id))]
          const ownerIds = [...new Set(data.map(c => c.owner_id))]
          const boardingHouseIds = [...new Set(data.map(c => c.boarding_house_id).filter(Boolean))]

          const [students, owners, boardingHouses] = await Promise.all([
            supabase.from('users').select('id, name, picture').in('id', studentIds),
            supabase.from('users').select('id, name, picture').in('id', ownerIds),
            boardingHouseIds.length > 0 
              ? supabase.from('boarding_houses').select('id, name').in('id', boardingHouseIds)
              : Promise.resolve({ data: [] })
          ])

          const studentMap = {}
          const ownerMap = {}
          const bhMap = {}
          
          students.data?.forEach(u => { studentMap[u.id] = u })
          owners.data?.forEach(u => { ownerMap[u.id] = u })
          boardingHouses.data?.forEach(bh => { bhMap[bh.id] = bh })

          this.conversations = data.map(conv => ({
            ...conv,
            student: studentMap[conv.student_id],
            owner: ownerMap[conv.owner_id],
            boarding_house: conv.boarding_house_id ? bhMap[conv.boarding_house_id] : null
          }))
        } else {
          this.conversations = []
        }
        await this.fetchUnreadCount(userId)
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        this.loading = false
      }
    },

    // Create or get existing conversation
    async createConversation(studentId, ownerId, boardingHouseId = null) {
      try {
        // Check if conversation already exists
        let query = supabase
          .from('conversations')
          .select('*')
          .eq('student_id', studentId)
          .eq('owner_id', ownerId)

        if (boardingHouseId) {
          query = query.eq('boarding_house_id', boardingHouseId)
        } else {
          query = query.is('boarding_house_id', null)
        }

        const { data: existing, error: checkError } = await query.maybeSingle()

        if (existing) {
          return existing
        }

        // Create new conversation
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            student_id: studentId,
            owner_id: ownerId,
            boarding_house_id: boardingHouseId
          })
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error('Error creating conversation:', error)
        return null
      }
    },

    // Fetch messages for a conversation
    async fetchMessages(conversationId) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        if (error) throw error

        // Fetch sender details for each unique sender
        if (data && data.length > 0) {
          const senderIds = [...new Set(data.map(m => m.sender_id))]
          const { data: users } = await supabase
            .from('users')
            .select('id, name, picture')
            .in('id', senderIds)

          const userMap = {}
          users?.forEach(u => { userMap[u.id] = u })

          this.messages = data.map(msg => ({
            ...msg,
            sender: userMap[msg.sender_id]
          }))
        } else {
          this.messages = []
        }

        this.currentConversation = conversationId

        // Mark messages as read
        await this.markMessagesAsRead(conversationId)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        this.loading = false
      }
    },

    // Send a message
    async sendMessage(conversationId, senderId, receiverId, content) {
      try {
        console.log('Sending message with params:', {
          conversationId,
          senderId,
          receiverId,
          content: content.trim(),
          types: {
            conversationId: typeof conversationId,
            senderId: typeof senderId,
            receiverId: typeof receiverId
          }
        })

        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            receiver_id: receiverId,
            content: content.trim()
          })
          .select()
          .single()

        if (error) {
          console.error('Supabase error sending message:', error)
          throw error
        }

        console.log('Message sent successfully:', data)

        // Fetch sender details
        const { data: sender } = await supabase
          .from('users')
          .select('id, name, picture')
          .eq('id', senderId)
          .single()

        const messageWithSender = { ...data, sender }

        // Update conversation's last message
        await supabase
          .from('conversations')
          .update({
            last_message: content.trim(),
            last_message_at: new Date().toISOString()
          })
          .eq('id', conversationId)

        return messageWithSender
      } catch (error) {
        console.error('Error sending message:', error)
        return null
      }
    },

    // Mark messages as read
    async markMessagesAsRead(conversationId) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        const { error } = await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .eq('receiver_id', user.id)
          .eq('is_read', false)

        if (error) throw error

        await this.fetchUnreadCount(user.id)
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    },

    // Fetch unread message count
    async fetchUnreadCount(userId) {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', userId)
          .eq('is_read', false)

        if (error) throw error
        this.unreadCount = count || 0
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    },

    // Subscribe to real-time messages
    subscribeToMessages(conversationId, userId) {
      this.unsubscribeFromMessages()

      this.realtimeChannel = supabase
        .channel(`conversation:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          async (payload) => {
            console.log('Real-time message received:', payload.new)
            
            // Check if message already exists (avoid duplicates)
            const exists = this.messages.some(m => m.id === payload.new.id)
            if (exists) {
              console.log('Message already exists, skipping duplicate')
              return
            }

            // Fetch sender details
            const { data: sender } = await supabase
              .from('users')
              .select('id, name, picture')
              .eq('id', payload.new.sender_id)
              .single()

            const newMessage = {
              ...payload.new,
              sender
            }

            this.messages.push(newMessage)
            console.log('Message added via real-time subscription')

            // Mark as read if current user is receiver
            if (payload.new.receiver_id === userId) {
              await this.markMessagesAsRead(conversationId)
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
            filter: `id=eq.${conversationId}`
          },
          (payload) => {
            // Update conversation in list
            const index = this.conversations.findIndex(c => c.id === payload.new.id)
            if (index !== -1) {
              this.conversations[index] = {
                ...this.conversations[index],
                ...payload.new
              }
            }
          }
        )
        .subscribe()
    },

    // Subscribe to conversation updates (for conversation list)
    subscribeToConversations(userId) {
      const channel = supabase
        .channel('conversations-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations'
          },
          async (payload) => {
            // Refresh conversations if this user is involved
            if (
              payload.new?.student_id === userId || 
              payload.new?.owner_id === userId ||
              payload.old?.student_id === userId || 
              payload.old?.owner_id === userId
            ) {
              const { data: { user } } = await supabase.auth.getUser()
              if (user?.user_metadata?.role) {
                await this.fetchConversations(userId, user.user_metadata.role)
              }
            }
          }
        )
        .subscribe()

      return channel
    },

    // Unsubscribe from real-time messages
    unsubscribeFromMessages() {
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel)
        this.realtimeChannel = null
      }
    },

    // Clear current conversation
    clearCurrentConversation() {
      this.currentConversation = null
      this.messages = []
      this.unsubscribeFromMessages()
    }
  }
})