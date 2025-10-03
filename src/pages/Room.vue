<template>
  <div class="room-page">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Conectando à sala...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-card neon-border">
        <h2>❌ Erro ao conectar</h2>
        <p>{{ error }}</p>
        <button class="btn primary" @click="goHome">Voltar ao Início</button>
      </div>
    </div>

    <!-- Chat room -->
    <ChatRoom
      v-else-if="roomData"
      :room-address="roomAddress"
      :room-name="roomData.name"
      :user-id="userId"
      @leave-room="handleLeaveRoom"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChatRoom from '../components/ChatRoom.vue'
import { navigateTo } from '../utils/navigation.js'

const props = defineProps({
  roomAddress: {
    type: String,
    required: true
  }
})

// Estado do componente
const loading = ref(true)
const error = ref(null)
const roomData = ref(null)
const userId = ref(1296) // ID fictício por enquanto

// Buscar dados da sala
const fetchRoomData = async () => {
  try {
    loading.value = true
    error.value = null

    // Buscar informações da sala
    const response = await fetch(`/api/rooms`)
    
    if (!response.ok) {
      throw new Error('Erro ao buscar informações da sala')
    }

    const rooms = await response.json()
    
    // Encontrar a sala pelo endereço
    const room = rooms.find(r => r.address === props.roomAddress)
    
    if (!room) {
      throw new Error('Sala não encontrada')
    }

    roomData.value = room
    
  } catch (err) {
    console.error('Erro ao buscar dados da sala:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Sair da sala
const handleLeaveRoom = () => {
  goHome()
}

// Voltar para home
const goHome = () => {
  navigateTo('/')
}

// Lifecycle
onMounted(() => {
  fetchRoomData()
})
</script>

<style scoped>
.room-page {
  height: 100vh;
  background: var(--color-background);
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-neon-cyan);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.error-card {
  background: var(--color-background-panel);
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.error-card h2 {
  margin: 0 0 15px 0;
  color: var(--color-neon-pink);
}

.error-card p {
  margin: 0 0 25px 0;
  color: var(--color-text-secondary);
}
</style>
