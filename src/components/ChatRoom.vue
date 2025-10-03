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
      <div v-for="message in messages" :key="message.timestamp + message.sender" class="message"
        :class="{ 'own-message': message.sender === currentUserId }">
        <div class="message-header">
          <span class="sender">Usuário {{ message.sender }}</span>
          <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
        </div>
        <div class="message-content">{{ message.message }}</div>
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
import { createChatWebSocket, formatMessageTimestamp, validateMessage } from '../utils/websocket.js'

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

  chatWebSocket.setOnMessage((message) => {
    if (validateMessage(message)) {
      // Adicionar mensagem à lista
      messages.value.push(message)

      // Scroll para o final
      nextTick(() => {
        scrollToBottom()
      })
    }
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

  .message-form {
    flex-direction: column;
  }

  .send-btn {
    width: 100%;
  }
}
</style>
