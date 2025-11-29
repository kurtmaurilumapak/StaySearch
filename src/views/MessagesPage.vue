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
  <div class="messages-page">
    <!-- Modern Header with Glassmorphism -->
    <div class="messages-header">
      <v-container>
        <div class="header-content">
          <div class="d-flex align-center">
            <v-btn
              icon
              size="large"
              class="back-btn mr-3"
              @click="goBackToDashboard"
              elevation="0"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="header-icon-wrapper">
              <v-icon size="32" color="white">mdi-message-text</v-icon>
            </div>
            <div class="header-text ml-4">
              <h1 class="header-title">Messages</h1>
              <p class="header-subtitle">Stay connected with property owners</p>
            </div>
          </div>
          <v-badge
            v-if="messageStore.unreadCount > 0"
            :content="messageStore.unreadCount"
            color="error"
            class="unread-badge"
          >
            <v-chip
              color="white"
              variant="flat"
              class="notification-chip"
            >
              <v-icon start>mdi-bell</v-icon>
              Notifications
            </v-chip>
          </v-badge>
        </div>
      </v-container>
    </div>

    <v-container fluid class="messages-container pa-4">
      <v-row class="messages-row no-gutters">
        <!-- Conversations List -->
        <v-col cols="12" md="4" lg="3" class="conversations-column pa-0">
          <v-card class="conversations-card modern-card" elevation="0">
            <div class="card-header pa-4">
              <h3 class="card-title">
                <v-icon color="green-darken-2" class="mr-2">mdi-forum</v-icon>
                Conversations
              </h3>
            </div>

            <v-divider />

            <div class="search-container pa-4">
              <v-text-field
                v-model="searchQuery"
                density="comfortable"
                variant="solo-filled"
                placeholder="Search conversations..."
                prepend-inner-icon="mdi-magnify"
                hide-details
                flat
                rounded="xl"
                clearable
                class="modern-search"
              />
            </div>

            <v-divider />

          <div class="conversations-list">
            <div class="conversations-wrapper pa-3">
              <div
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                @click="selectConversation(conversation)"
                class="conversation-item"
                :class="{ 'active': messageStore.currentConversation === conversation.id }"
              >
                <v-avatar size="56" class="conversation-avatar">
                  <v-img :src="getConversationPicture(conversation)" />
                </v-avatar>
                
                <div class="conversation-content">
                  <div class="conversation-header">
                    <h4 class="conversation-name">{{ getConversationName(conversation) }}</h4>
                    <span class="conversation-time">{{ formatTime(conversation.last_message_at) }}</span>
                  </div>
                  <p class="conversation-message">
                    {{ conversation.last_message || 'No messages yet' }}
                  </p>
                </div>

                <div v-if="messageStore.currentConversation === conversation.id" class="active-indicator"></div>
              </div>

              <div v-if="filteredConversations.length === 0" class="empty-state pa-8 text-center">
                <div class="empty-icon-wrapper mb-4">
                  <v-icon size="80" color="grey-lighten-3">mdi-message-outline</v-icon>
                </div>
                <h4 class="empty-title">No conversations yet</h4>
                <p class="empty-subtitle">Start chatting with property owners</p>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Messages Area -->
      <v-col cols="12" md="8" lg="9" class="messages-column pa-0">
        <v-card v-if="messageStore.currentConversation" class="messages-card modern-card" elevation="0">
          <!-- Chat Header -->
          <div class="chat-header pa-4">
            <div class="d-flex align-center">
              <v-avatar size="48" class="chat-avatar mr-3">
                <v-img :src="otherUser?.picture || '/csu.png'" />
              </v-avatar>
              <div class="flex-grow-1">
                <h3 class="chat-name">{{ otherUser?.name }}</h3>
                <div class="d-flex align-center">
                  <div class="status-dot"></div>
                  <p v-if="currentConversationData?.boarding_house" class="chat-property mb-0">
                    {{ currentConversationData.boarding_house.name }}
                  </p>
                  <p v-else class="chat-status mb-0">Active now</p>
                </div>
              </div>
              <v-btn
                icon
                variant="text"
                size="small"
                class="ml-2"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </div>
          </div>

          <v-divider />

          <!-- Messages Container -->
          <div ref="messageContainer" class="messages-scroll">
            <div class="messages-content pa-6">
              <div
                v-for="message in messageStore.messages"
                :key="message.id"
                class="message-group"
                :class="{ 'message-group-own': message.sender_id === userStore.userData.id }"
              >
                <v-avatar 
                  v-if="message.sender_id !== userStore.userData.id"
                  size="32" 
                  class="message-avatar"
                >
                  <v-img :src="message.sender?.picture || '/csu.png'" />
                </v-avatar>
                
                <div class="message-container">
                  <div class="message-bubble">
                    <p class="message-text">{{ message.content }}</p>
                  </div>
                  <div class="message-meta">
                    <span v-if="message.sender_id !== userStore.userData.id" class="message-sender">
                      {{ message.sender?.name }}
                    </span>
                    <span class="message-time">{{ formatTime(message.created_at) }}</span>
                    <v-icon 
                      v-if="message.sender_id === userStore.userData.id"
                      size="14"
                      color="green-darken-2"
                      class="ml-1"
                    >
                      mdi-check-all
                    </v-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <v-divider />
          <div class="message-input-container pa-4">
            <div class="message-input-wrapper">
              <v-btn
                icon
                variant="text"
                size="small"
                class="mr-2"
              >
                <v-icon>mdi-emoticon-happy-outline</v-icon>
              </v-btn>
              
              <v-textarea
                v-model="newMessage"
                variant="solo-filled"
                placeholder="Type your message..."
                rows="1"
                auto-grow
                max-rows="4"
                hide-details
                flat
                class="message-input flex-grow-1"
                @keydown.enter.exact.prevent="sendMessage"
              />
              
              <v-btn
                icon
                variant="text"
                size="small"
                class="mx-2"
              >
                <v-icon>mdi-paperclip</v-icon>
              </v-btn>

              <v-btn
                icon
                color="green-darken-2"
                :disabled="!newMessage.trim()"
                @click="sendMessage"
                class="send-btn"
                elevation="2"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Empty State -->
        <v-card v-else class="messages-card modern-card empty-chat-state" elevation="0">
          <div class="empty-chat-content text-center">
            <div class="empty-chat-icon-wrapper mb-6">
              <v-icon size="140" color="green-lighten-4">mdi-message-text-outline</v-icon>
            </div>
            <h2 class="empty-chat-title mb-3">Select a Conversation</h2>
            <p class="empty-chat-subtitle mb-6">
              Choose a conversation from the list to start messaging with property owners
            </p>
            <div class="empty-chat-features">
              <div class="feature-item">
                <v-icon color="green-darken-2" class="mb-2">mdi-flash</v-icon>
                <p>Real-time messaging</p>
              </div>
              <div class="feature-item">
                <v-icon color="green-darken-2" class="mb-2">mdi-shield-check</v-icon>
                <p>Secure & private</p>
              </div>
              <div class="feature-item">
                <v-icon color="green-darken-2" class="mb-2">mdi-clock-fast</v-icon>
                <p>Instant notifications</p>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<style scoped>
/* Base Layout */
.messages-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Modern Header */
.messages-header {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.messages-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: headerGlow 8s ease-in-out infinite;
}

@keyframes headerGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-4px);
}

.header-icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
}

.notification-chip {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.messages-container {
  max-width: 1600px;
  margin: -3rem auto 0;
  padding: 0 1rem 2rem !important;
}

.messages-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
}

.conversations-column {
  flex: 0 0 380px;
  max-width: 380px;
}

.messages-column {
  flex: 1;
  min-width: 0;
}

/* Modern Cards */
.modern-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}

.conversations-column .modern-card {
  border-radius: 20px 0 0 20px !important;
}

.messages-column .modern-card {
  border-radius: 0 20px 20px 0 !important;
  border-left: none;
}

.modern-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12) !important;
}

.card-header {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
}

/* Search */
.modern-search :deep(.v-field) {
  border-radius: 16px !important;
  background: rgba(76, 175, 80, 0.05) !important;
  transition: all 0.3s ease;
}

.modern-search :deep(.v-field:hover) {
  background: rgba(76, 175, 80, 0.08) !important;
}

.modern-search :deep(.v-field--focused) {
  background: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

/* Conversations List */
.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversations-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conversation-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 16px;
  background: white;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.conversation-item:hover {
  background: rgba(76, 175, 80, 0.05);
  border-color: rgba(76, 175, 80, 0.2);
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.conversation-item.active {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-color: #4caf50;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.2);
}

.conversation-avatar {
  border: 3px solid #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  flex-shrink: 0;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
}

.conversation-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 0.75rem;
  color: #9e9e9e;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.conversation-message {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  border-radius: 0 4px 4px 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Chat Header */
.chat-header {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.chat-avatar {
  border: 3px solid #4caf50;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
}

.chat-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0);
  }
}

.chat-property {
  font-size: 0.85rem;
  color: #666;
}

.chat-status {
  font-size: 0.85rem;
  color: #4caf50;
  font-weight: 600;
}

/* Messages */
.messages-scroll {
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.messages-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100%;
}

.message-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-group-own {
  flex-direction: row-reverse;
}

.message-avatar {
  border: 2px solid #e0e0e0;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-container {
  max-width: 65%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-group-own .message-container {
  align-items: flex-end;
}

.message-bubble {
  padding: 0.875rem 1.125rem;
  border-radius: 18px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.message-bubble:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.message-group-own .message-bubble {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
}

.message-text {
  margin: 0;
  word-wrap: break-word;
  line-height: 1.6;
  font-size: 0.95rem;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #9e9e9e;
}

.message-group-own .message-meta {
  justify-content: flex-end;
}

.message-sender {
  font-weight: 600;
  color: #4caf50;
}

.message-time {
  opacity: 0.8;
}

/* Message Input */
.message-input-container {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.message-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.message-input :deep(.v-field) {
  border-radius: 24px !important;
  background: rgba(76, 175, 80, 0.05) !important;
}

.message-input :deep(.v-field:hover) {
  background: rgba(76, 175, 80, 0.08) !important;
}

.message-input :deep(.v-field--focused) {
  background: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.send-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.send-btn:not(:disabled):hover {
  transform: scale(1.1) rotate(-10deg);
  box-shadow: 0 6px 24px rgba(76, 175, 80, 0.4) !important;
}

/* Empty States */
.empty-state {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-icon-wrapper {
  display: inline-block;
  padding: 1.5rem;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 50%;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  color: #9e9e9e;
  margin: 0;
  font-size: 0.95rem;
}

.empty-chat-state {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.empty-chat-content {
  max-width: 500px;
  padding: 3rem;
}

.empty-chat-icon-wrapper {
  display: inline-block;
  padding: 2rem;
  background: rgba(76, 175, 80, 0.08);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-chat-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a1a;
}

.empty-chat-subtitle {
  color: #666;
  font-size: 1.05rem;
  line-height: 1.6;
}

.empty-chat-features {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}

.feature-item {
  text-align: center;
}

.feature-item p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  font-weight: 600;
}

/* Scrollbar Styles */
.conversations-list::-webkit-scrollbar,
.messages-scroll::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-scroll::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  transition: background 0.3s ease;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}

/* Responsive Design */
@media (max-width: 960px) {
  .messages-header {
    padding: 1.5rem 0;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .messages-container {
    margin-top: -2rem;
  }

  .messages-row {
    flex-wrap: wrap;
  }

  .conversations-column {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .messages-column {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .conversations-column .modern-card,
  .messages-column .modern-card {
    border-radius: 20px !important;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    height: auto;
    min-height: 400px;
  }

  .modern-card {
    height: calc(100vh - 140px);
  }

  .conversation-item {
    padding: 0.875rem;
  }

  .message-container {
    max-width: 80%;
  }
}

@media (max-width: 600px) {
  .header-title {
    font-size: 1.25rem;
  }

  .header-subtitle {
    display: none;
  }

  .notification-chip {
    display: none;
  }
}
</style>