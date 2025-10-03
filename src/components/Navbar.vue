<template>
  <header class="navbar neon-border">
    <div class="logo glitch" @click="handleLogoClick">
      Cipher Talk
    </div>
    <nav>
      <a href="/" @click="handleHomeClick">
        Recursos
      </a>
      <a href="#como-funciona" @click="handleHomeClick">
        Como funciona
      </a>
      <a href="#salas" @click="handleSalasClick">
        Salas Públicas
      </a>
    </nav>
    <div class="nav-actions">
      <button class="btn secondary">Entrar</button>
      <button 
        v-if="showCreateButton" 
        class="btn primary" 
        @click="handleCreateRoomClick"
      >
        Criar Sala
      </button>
    </div>
  </header>
</template>

<script setup>
import { navigateTo } from '../utils/navigation.js'

defineProps({
  showCreateButton: {
    type: Boolean,
    default: true
  }
})

const handleLogoClick = () => {
  navigateTo("/")
}

const handleHomeClick = (e) => {
  e.preventDefault()
  navigateTo("/")
}

const handleSalasClick = (e) => {
  e.preventDefault()
  navigateTo("/")
  setTimeout(() => {
    document.getElementById("salas")?.scrollIntoView({ behavior: "smooth" })
  }, 100)
}

const handleCreateRoomClick = () => {
  navigateTo("/create-room")
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  align-items: center;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(6px);
}

.navbar .logo {
  font-size: 22px;
  cursor: pointer;
  user-select: none;
}

.navbar nav {
  display: flex;
  gap: 12px;
}

.navbar nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}

.navbar nav a:hover {
  color: var(--color-neon-cyan);
}

.nav-actions {
  display: flex;
  gap: 12px;
}

/* RESPONSIVIDADE */
@media (max-width: 768px) {
  .navbar nav {
    display: none;
  }

  .nav-actions {
    gap: 8px;
  }

  .nav-actions .btn {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
