<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore'
import { useUserStore } from '@/stores/userStore'
import { formatDistanceToNow } from 'date-fns'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()
const userStore = useUserStore()

const newMessage = ref('')
const messageContainer = ref(null)
const searchQuery = ref('')

onMounted(async () => {
  try {
    await userStore.fetchUserData()
    console.log('User data loaded:', userStore.userData)
    
    // If conversationId is in query, set it up
    if (route.query.conversationId) {
      const conversationId = parseInt(route.query.conversationId)
      console.log('Auto-opening conversation:', conversationId)
      
      // Set the current conversation ID immediately so UI shows
      messageStore.currentConversation = conversationId
      
      // Try to fetch messages for this conversation
      try {
        await messageStore.fetchMessages(conversationId)
        console.log('Messages loaded:', messageStore.messages.length)
        
        messageStore.subscribeToMessages(conversationId, userStore.userData.id)
        
        await nextTick()
        scrollToBottom()
      } catch (msgError) {
        console.error('Error fetching messages, but conversation is open:', msgError)
        // Even if fetching fails, the conversation is open and user can send new messages
      }
    }
    
    // Then fetch all conversations (this might also fail, but don't block the UI)
    try {
      await messageStore.fetchConversations(
        userStore.userData.id,
        userStore.userData.role
      )
      console.log('Conversations loaded:', messageStore.conversations.length)
    } catch (convError) {
      console.error('Error loading conversations list:', convError)
    }
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})

onUnmounted(() => {
  messageStore.unsubscribeFromMessages()
})

const filteredConversations = computed(() => {
  if (!searchQuery.value) return messageStore.conversations
  
  const query = searchQuery.value.toLowerCase()
  return messageStore.conversations.filter(conv => {
    const otherUser = userStore.userData.role === 'student' 
      ? conv.owner 
      : conv.student
    return otherUser.name.toLowerCase().includes(query)
  })
})

const currentConversationData = computed(() => {
  return messageStore.conversations.find(
    c => c.id === messageStore.currentConversation
  )
})

const otherUser = computed(() => {
  if (!currentConversationData.value) {
    // If conversation data not loaded yet, try getting from messages
    const firstMessage = messageStore.messages[0]
    if (firstMessage) {
      const isOwn = firstMessage.sender_id === userStore.userData.id
      return isOwn ? null : firstMessage.sender
    }
    
    // Fallback: Get from URL query params
    if (route.query.ownerName) {
      return {
        id: route.query.ownerId,
        name: route.query.ownerName,
        picture: null
      }
    }
    
    return null
  }
  return userStore.userData.role === 'student'
    ? currentConversationData.value.owner
    : currentConversationData.value.student
})

const selectConversation = async (conversation) => {
  await messageStore.fetchMessages(conversation.id)
  messageStore.subscribeToMessages(conversation.id, userStore.userData.id)
  await nextTick()
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !messageStore.currentConversation) return

  // Get receiver ID from conversation data or messages or URL
  let receiverId
  if (currentConversationData.value) {
    receiverId = userStore.userData.role === 'student'
      ? currentConversationData.value.owner_id
      : currentConversationData.value.student_id
  } else if (messageStore.messages.length > 0) {
    // Get from first message
    const firstMessage = messageStore.messages[0]
    receiverId = firstMessage.sender_id === userStore.userData.id
      ? firstMessage.receiver_id
      : firstMessage.sender_id
  } else if (route.query.ownerId) {
    // Fallback to URL query param
    receiverId = route.query.ownerId
  }

  if (!receiverId) {
    console.error('Cannot determine receiver ID')
    alert('Unable to send message. Please refresh and try again.')
    return
  }

  const sentMessage = await messageStore.sendMessage(
    messageStore.currentConversation,
    userStore.userData.id,
    receiverId,
    newMessage.value
  )

  if (sentMessage) {
    // Add the sent message to the local messages array immediately
    messageStore.messages.push(sentMessage)
    
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } else {
    alert('Failed to send message. Please check your connection.')
  }
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

const getConversationName = (conversation) => {
  const user = userStore.userData.role === 'student' 
    ? conversation.owner 
    : conversation.student
  return user.name
}

const getConversationPicture = (conversation) => {
  const user = userStore.userData.role === 'student' 
    ? conversation.owner 
    : conversation.student
  return user.picture || '/csu.png'
}

const goBackToDashboard = () => {
  if (userStore.userData.role === 'student') {
    router.push('/student/page')
  } else if (userStore.userData.role === 'owner') {
    router.push('/owner/dashboard')
  } else if (userStore.userData.role === 'admin') {
    router.push('/admin/dashboard')
  }
}
</script>

<template>
  <v-container fluid class="messages-container pa-0">
    <v-row class="ma-0" style="height: 100vh;">
      <!-- Conversations List -->
      <v-col cols="12" md="4" lg="3" class="conversations-column pa-0">
        <v-card class="conversations-card" elevation="0" rounded="0">
          <v-card-title class="conversations-header pa-6">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <v-btn
                  icon
                  variant="text"
                  @click="goBackToDashboard"
                  class="mr-2"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-icon size="28" color="green-darken-2" class="mr-3">
                  mdi-message-text
                </v-icon>
                <h3 class="text-h6 font-weight-bold">Messages</h3>
              </div>
              <v-badge
                v-if="messageStore.unreadCount > 0"
                :content="messageStore.unreadCount"
                color="red"
                inline
              />
            </div>
          </v-card-title>

          <v-divider />

          <div class="search-container pa-4">
            <v-text-field
              v-model="searchQuery"
              density="comfortable"
              variant="outlined"
              placeholder="Search conversations..."
              prepend-inner-icon="mdi-magnify"
              hide-details
              rounded="lg"
              clearable
            />
          </div>

          <v-divider />

          <div class="conversations-list">
            <v-list class="pa-2">
              <v-list-item
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                :active="messageStore.currentConversation === conversation.id"
                @click="selectConversation(conversation)"
                class="conversation-item mb-2"
                rounded="xl"
              >
                <template v-slot:prepend>
                  <v-avatar size="48" class="conversation-avatar">
                    <v-img :src="getConversationPicture(conversation)" />
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold mb-1">
                  {{ getConversationName(conversation) }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption">
                  <div class="d-flex align-center">
                    <span class="conversation-preview">
                      {{ conversation.last_message || 'No messages yet' }}
                    </span>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatTime(conversation.last_message_at) }}
                  </div>
                </template>
              </v-list-item>

              <div v-if="filteredConversations.length === 0" class="pa-8 text-center">
                <v-icon size="64" color="grey-lighten-2" class="mb-4">
                  mdi-message-outline
                </v-icon>
                <p class="text-body-2 text-medium-emphasis">
                  No conversations yet
                </p>
              </div>
            </v-list>
          </div>
        </v-card>
      </v-col>

      <!-- Messages Area -->
      <v-col cols="12" md="8" lg="9" class="messages-column pa-0">
        <v-card v-if="messageStore.currentConversation" class="messages-card" elevation="0" rounded="0">
          <!-- Chat Header -->
          <v-card-title class="chat-header pa-4">
            <div class="d-flex align-center">
              <v-avatar size="42" class="mr-3">
                <v-img :src="otherUser?.picture || '/csu.png'" />
              </v-avatar>
              <div>
                <h4 class="font-weight-bold">{{ otherUser?.name }}</h4>
                <p v-if="currentConversationData?.boarding_house" class="text-caption text-medium-emphasis mb-0">
                  {{ currentConversationData.boarding_house.name }}
                </p>
              </div>
            </div>
          </v-card-title>

          <v-divider />

          <!-- Messages Container -->
          <div ref="messageContainer" class="messages-scroll">
            <div class="messages-content pa-4">
              <div
                v-for="message in messageStore.messages"
                :key="message.id"
                class="message-wrapper"
                :class="{ 'message-own': message.sender_id === userStore.userData.id }"
              >
                <div class="message-bubble">
                  <div v-if="message.sender_id !== userStore.userData.id" class="d-flex align-center mb-2">
                    <v-avatar size="24" class="mr-2">
                      <v-img :src="message.sender?.picture || '/csu.png'" />
                    </v-avatar>
                    <span class="text-caption font-weight-medium">
                      {{ message.sender?.name }}
                    </span>
                  </div>
                  <p class="message-text mb-2">{{ message.content }}</p>
                  <span class="message-time">
                    {{ formatTime(message.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <v-divider />
          <div class="message-input-container pa-4">
            <v-textarea
              v-model="newMessage"
              variant="outlined"
              placeholder="Type your message..."
              rows="2"
              auto-grow
              hide-details
              rounded="lg"
              @keydown.enter.prevent="sendMessage"
            >
              <template v-slot:append-inner>
                <v-btn
                  icon
                  color="green-darken-2"
                  :disabled="!newMessage.trim()"
                  @click="sendMessage"
                  size="small"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </div>
        </v-card>

        <!-- Empty State -->
        <v-card v-else class="messages-card d-flex align-center justify-center" elevation="0" rounded="0">
          <div class="text-center pa-8">
            <v-icon size="120" color="grey-lighten-2" class="mb-6">
              mdi-message-text-outline
            </v-icon>
            <h3 class="text-h5 font-weight-bold mb-3">Select a conversation</h3>
            <p class="text-body-1 text-medium-emphasis">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.messages-container {
  height: 100vh;
  overflow: hidden;
}

.conversations-column,
.messages-column {
  height: 100vh;
}

.conversations-card,
.messages-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.conversations-header {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.conversation-item:hover {
  background: rgba(76, 175, 80, 0.08);
}

.conversation-item.v-list-item--active {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.conversation-avatar {
  border: 2px solid #4caf50;
}

.conversation-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 200px;
}

.chat-header {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.messages-scroll {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
}

.messages-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
  animation: fadeInUp 0.3s ease;
}

.message-wrapper.message-own {
  justify-content: flex-end;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-own .message-bubble {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
}

.message-text {
  margin: 0;
  word-wrap: break-word;
  line-height: 1.5;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-input-container {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Scrollbar Styles */
.conversations-list::-webkit-scrollbar,
.messages-scroll::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-scroll::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-scroll::-webkit-scrollbar-thumb:hover {
  background: #2e7d32;
}

@media (max-width: 960px) {
  .conversations-column {
    border-right: none;
  }
}
</style>