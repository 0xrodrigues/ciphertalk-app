<template>
  <div class="room-card neon-border">
    <h3 class="room-title glitch">{{ name }}</h3>
    <p class="room-desc">{{ description }}</p>
    <div class="room-info">
      <div class="room-meta">
        <span class="room-date">{{ createdAt }}</span>
        <span class="room-users">{{ maxUsers }} usuários máx</span>
      </div>
      <div class="room-address">
        <span class="address-label">Endereço:</span>
        <code class="address-code">{{ address }}</code>
      </div>
    </div>
    <div class="room-footer">
      <button
        class="btn primary join-btn"
        @click="handleJoinRoom"
        :disabled="joining"
      >
        {{ joining ? 'Entrando...' : 'Entrar na Sala →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo } from '../utils/navigation.js'

const props = defineProps({
  name: String,
  description: String,
  createdAt: String,
  address: String,
  maxUsers: {
    type: Number,
    default: 10
  }
})

const joining = ref(false)

const handleJoinRoom = async () => {
  if (!props.address) {
    console.error('Endereço da sala não fornecido')
    return
  }

  joining.value = true

  try {
    // Simular um pequeno delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 500))

    // Navegar para a sala
    navigateTo(`/room/${props.address}`)
  } catch (error) {
    console.error('Erro ao entrar na sala:', error)
  } finally {
    joining.value = false
  }
}
</script>

<style scoped>
.room-card {
  background: var(--color-background-panel);
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.room-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 12px var(--color-neon-cyan);
}

.room-title {
  font-size: 20px;
  margin: 0;
}

.room-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  flex: 1;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.room-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.room-date {
  color: var(--color-text-secondary);
}

.room-users {
  color: var(--color-neon-cyan);
  font-weight: bold;
}

.room-address {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.address-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.address-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--color-neon-cyan);
  background: rgba(6, 182, 212, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  word-break: break-all;
}

.room-footer {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.join-btn {
  width: 100%;
  padding: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.join-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.join-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .room-card {
    padding: 15px;
  }

  .room-title {
    font-size: 18px;
  }

  .room-desc {
    font-size: 13px;
  }

  .address-code {
    font-size: 10px;
  }
}
</style>
