<template>
  <div class="chat-room">
    <!-- Header da sala -->
    <div class="chat-header neon-border">
      <div class="room-info">
        <h2 class="room-name glitch">{{ roomName }}</h2>
        <span class="room-address">{{ roomAddress }}</span>
      </div>
      <div class="chat-actions">
        <span class="user-count">{{ onlineUsers }} usuários online</span>
        <button class="btn secondary" @click="leaveRoom">Sair da Sala</button>
      </div>
    </div>

    <!-- Área de mensagens -->
    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="no-messages">
        <p>Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!</p>
      </div>
      <div
        v-for="(item, index) in messages"
        :key="index"
        :class="getMessageClass(item)"
      >
        <!-- Mensagem de texto normal -->
        <template v-if="item.type === 'TEXT'">
          <div class="message-header">
            <span class="sender">Usuário {{ item.sender }}</span>
            <span class="timestamp">{{ formatTimestamp(item.timestamp) }}</span>
          </div>
          <div class="message-content">{{ item.message }}</div>
        </template>

        <!-- Notificação de usuário -->
        <template v-else-if="item.type === 'USER_EVENT'">
          <div class="notification-content">
            <span class="notification-icon">{{ getNotificationIcon(item.event) }}</span>
            <span class="notification-text">{{ getNotificationText(item) }}</span>
            <span class="notification-time">{{ formatTimestamp(item.timestamp) }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Input de mensagem -->
    <div class="message-input-container neon-border">
      <form @submit="sendMessage" class="message-form">
        <input v-model="newMessage" type="text" placeholder="Digite sua mensagem..." class="message-input"
          :disabled="!isConnected" maxlength="500" />
        <button type="submit" class="btn primary send-btn" :disabled="!newMessage.trim() || !isConnected">
          Enviar
        </button>
      </form>
      <div class="connection-status">
        <span :class="connectionStatusClass">
          {{ connectionStatusText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { createChatWebSocket, formatMessageTimestamp, validateMessage, validateUserNotification } from '../utils/websocket.js'

const props = defineProps({
  roomAddress: {
    type: String,
    required: true
  },
  roomName: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    default: 1296 // ID fictício por enquanto
  }
})

const emit = defineEmits(['leave-room'])

// Estado do componente
const messages = ref([])
const newMessage = ref('')
const isConnected = ref(false)
const onlineUsers = ref(1)
const messagesContainer = ref(null)
const currentUserId = ref(props.userId)

// WebSocket
let chatWebSocket = null

// Computed properties
const connectionStatusClass = computed(() => ({
  'status-connected': isConnected.value,
  'status-disconnected': !isConnected.value
}))

const connectionStatusText = computed(() =>
  isConnected.value ? 'Conectado' : 'Desconectado'
)

// Conectar ao WebSocket
const connectWebSocket = () => {
  chatWebSocket = createChatWebSocket(props.roomAddress, props.userId)

  // Configurar callbacks
  chatWebSocket.setOnConnectionChange((connected) => {
    isConnected.value = connected
  })

  chatWebSocket.setOnMessage((data) => {
    // Verificar se é uma notificação de usuário
    if (validateUserNotification(data)) {
      // Criar notificação de usuário
      const notification = {
        type: 'USER_EVENT',
        user: data.user,
        event: data.event,
        timestamp: new Date().toISOString()
      }

      messages.value.push(notification)

      // Atualizar contador de usuários online (estimativa)
      if (data.event === 'CONNECTED') {
        onlineUsers.value++
      } else if (data.event === 'DISCONNECTED' && onlineUsers.value > 0) {
        onlineUsers.value--
      }
    } else if (validateMessage(data)) {
      // Mensagem de texto normal
      messages.value.push(data)
    } else {
      console.warn('Mensagem recebida em formato inválido:', data)
    }

    // Scroll para o final
    nextTick(() => {
      scrollToBottom()
    })
  })

  chatWebSocket.setOnError((error) => {
    console.error('Erro na conexão WebSocket:', error)
  })

  // Conectar
  chatWebSocket.connect()
}

// Enviar mensagem
const sendMessage = (e) => {
  e.preventDefault()

  if (!newMessage.value.trim() || !isConnected.value || !chatWebSocket) {
    return
  }

  const success = chatWebSocket.sendMessage(newMessage.value)

  if (success) {
    newMessage.value = ''
  }
}

// Formatar timestamp
const formatTimestamp = (timestamp) => {
  return formatMessageTimestamp(timestamp)
}

// Obter classe CSS para mensagem/notificação
const getMessageClass = (item) => {
  if (item.type === 'USER_EVENT') {
    return 'notification'
  } else if (item.type === 'TEXT') {
    return {
      'message': true,
      'own-message': item.sender === currentUserId.value
    }
  }
  return 'message'
}

// Obter ícone para notificação
const getNotificationIcon = (event) => {
  switch (event) {
    case 'CONNECTED':
      return '🟢'
    case 'DISCONNECTED':
      return '🔴'
    default:
      return '📢'
  }
}

// Obter texto para notificação
const getNotificationText = (item) => {
  const userName = `Usuário ${item.user}`

  switch (item.event) {
    case 'CONNECTED':
      return `${userName} entrou na sala`
    case 'DISCONNECTED':
      return `${userName} saiu da sala`
    default:
      return `${userName} - evento desconhecido`
  }
}

// Scroll para o final das mensagens
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Sair da sala
const leaveRoom = () => {
  if (chatWebSocket) {
    chatWebSocket.disconnect()
  }
  emit('leave-room')
}

// Lifecycle hooks
onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (chatWebSocket) {
    chatWebSocket.disconnect()
  }
})
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-background);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--color-background-panel);
  border-bottom: 1px solid var(--color-neon-cyan);
}

.room-info h2 {
  margin: 0;
  font-size: 24px;
}

.room-address {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: 'JetBrains Mono', monospace;
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-count {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-background);
}

.no-messages {
  text-align: center;
  color: var(--color-text-secondary);
  margin-top: 50px;
}

.message {
  margin-bottom: 15px;
  padding: 12px;
  background: var(--color-background-panel);
  border-radius: 8px;
  border-left: 3px solid var(--color-neon-cyan);
}

.message.own-message {
  background: rgba(6, 182, 212, 0.1);
  border-left-color: var(--color-neon-pink);
  margin-left: 50px;
}

.notification {
  margin-bottom: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.notification-icon {
  font-size: 14px;
}

.notification-text {
  flex: 1;
  font-weight: 500;
}

.notification-time {
  font-size: 11px;
  opacity: 0.7;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.sender {
  color: var(--color-neon-cyan);
  font-weight: bold;
}

.timestamp {
  color: var(--color-text-secondary);
}

.message-content {
  color: var(--color-text-primary);
  word-wrap: break-word;
}

.message-input-container {
  padding: 20px;
  background: var(--color-background-panel);
  border-top: 1px solid var(--color-neon-cyan);
}

.message-form {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.message-input {
  flex: 1;
  padding: 12px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-primary);
  font-size: 14px;
}

.message-input:focus {
  outline: none;
  border-color: var(--color-neon-cyan);
  box-shadow: 0 0 5px rgba(6, 182, 212, 0.3);
}

.send-btn {
  padding: 12px 20px;
  white-space: nowrap;
}

.connection-status {
  text-align: center;
  font-size: 12px;
}

.status-connected {
  color: var(--color-neon-cyan);
}

.status-disconnected {
  color: var(--color-neon-pink);
}

/* Responsividade */
@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .message.own-message {
    margin-left: 20px;
  }

  .notification-content {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .notification-text {
    font-size: 12px;
  }

  .message-form {
    flex-direction: column;
  }

  .send-btn {
    width: 100%;
  }
}
</style>
