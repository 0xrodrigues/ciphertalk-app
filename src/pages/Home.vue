<template>
  <div class="home">
    <!-- NAVBAR -->
    <Navbar />

    <!-- HERO -->
    <section class="hero">
      <h1 class="glitch">Debates em tempo real</h1>
      <p>
        Entre em salas, participe por <span class="highlight">vídeo</span> ou
        <span class="highlight">texto</span>, e explore ideias em uma arena digital
        cyberpunk.
      </p>
      <div class="hero-actions">
        <button class="btn primary" @click="() => navigateTo('/create-room')">
          Criar uma Sala
        </button>
        <button class="btn secondary" @click="scrollToSalas">
          Explorar Salas
        </button>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="features">
      <h2 class="glitch-soft section-title">Recursos</h2>
      <div class="features-grid">
        <Feature icon="🎥" title="Debate por vídeo" desc="Abra a câmera e defenda seu ponto ao vivo." />
        <Feature icon="💬" title="Debate por chat" desc="Prefere texto? Troque ideias sem ligar a câmera." />
        <Feature icon="⚡" title="Tempo real" desc="Respostas rápidas, fluxo intenso, sem atrasos." />
      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section id="como-funciona" class="steps">
      <h2 class="glitch-soft section-title">Como funciona</h2>
      <Step :n="1" title="Crie uma sala" text="Defina título e descrição do debate." />
      <Step :n="2" title="Convide ou abra ao público" text="Envie link para amigos ou deixe aberto." />
      <Step :n="3" title="Debata em tempo real" text="Por vídeo ou chat, as ideias fluem no momento." />
    </section>

    <!-- SALAS PÚBLICAS -->
    <section id="salas" class="rooms-list">
      <h2 class="glitch-soft section-title">Salas Públicas</h2>

      <p v-if="loading" class="loading-message">Carregando salas...</p>

      <p v-if="error" class="error-message">Erro ao carregar salas: {{ error }}</p>

      <p v-if="!loading && !error && rooms.length === 0" class="empty-message">
        Nenhuma sala pública disponível no momento.
      </p>

      <div v-if="!loading && !error && rooms.length > 0" class="rooms-grid">
        <RoomCard
          v-for="room in rooms"
          :key="room.id"
          :name="room.name"
          :description="room.description"
          :created-at="formatDate(room.createdAt)"
          :address="room.address"
          :max-users="room.maxUsers"
          :hoster="room.hoster"
        />
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer neon-border">
      <p>© {{ new Date().getFullYear() }} Cipher Talk • Plataforma de debates em tempo real</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Feature from '../components/Feature.vue'
import Step from '../components/Step.vue'
import RoomCard from '../components/RoomCard.vue'
import { navigateTo } from '../utils/navigation.js'
import axios from "axios";

const rooms = ref([])
const loading = ref(true)
const error = ref(null)

const scrollToSalas = () => {
  document.getElementById('salas')?.scrollIntoView({ behavior: 'smooth' })
}

// Função para buscar as salas do backend
const fetchRooms = async () => {
  loading.value = true

  try {
    axios.get('/api/rooms').then(response => {
      rooms.value = response.data
      loading.value = false
    }).catch(error => {
      console.error('Erro ao buscar salas:', error)
      error.value = error.message
      loading.value = false
    })
  } catch {
    loading.value = true
    error.value = 'Erro ao carregar as salas'
  } finally {
    loading.value = false
  }
}

// Função para formatar a data no formato brasileiro
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

onMounted(() => {
  fetchRooms()
})
</script>

<style scoped>
.home {
  background: var(--color-background);
  min-height: 100vh;
}

.hero {
  padding: 60px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 36px;
  margin-bottom: 12px;
}

.hero p {
  color: var(--color-text-secondary);
}

.hero .highlight {
  color: var(--color-neon-pink);
}

.hero-actions {
  margin-top: 20px;
}

.features {
  padding: 40px 20px;
}

.section-title {
  font-size: 22px;
  margin-bottom: 20px;
  text-align: center;
}

.features-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.steps {
  padding: 40px 20px;
}

.rooms-list {
  padding: 40px 20px;
}

.rooms-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.loading-message,
.error-message,
.empty-message {
  text-align: center;
  padding: 40px 20px;
  font-size: 16px;
  color: var(--color-text-secondary);
}

.loading-message {
  color: var(--color-neon-cyan);
  animation: pulse 1.5s ease-in-out infinite;
}

.error-message {
  color: var(--color-neon-pink);
  background: rgba(255, 0, 100, 0.1);
  border: 1px solid var(--color-neon-pink);
  border-radius: 8px;
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
}

.empty-message {
  color: var(--color-text-secondary);
  font-style: italic;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.footer {
  text-align: center;
  padding: 20px;
  color: var(--color-text-secondary);
  margin-top: 40px;
}
</style>
