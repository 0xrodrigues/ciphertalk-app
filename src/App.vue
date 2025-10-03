<template>
  <Home v-if="currentPage === 'home'" />
  <CreateRoom v-else-if="currentPage === 'create-room'" />
  <Room v-else-if="currentPage === 'room'" :room-address="roomAddress" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Home from './pages/Home.vue'
import CreateRoom from './pages/CreateRoom.vue'
import Room from './pages/Room.vue'

const currentPage = ref('home')
const roomAddress = ref('')

const handleLocationChange = () => {
  const path = window.location.pathname

  if (path === '/create-room') {
    currentPage.value = 'create-room'
  } else if (path.startsWith('/room/')) {
    currentPage.value = 'room'
    roomAddress.value = path.split('/room/')[1]
  } else {
    currentPage.value = 'home'
  }
}

onMounted(() => {
  // Verificar URL inicial
  handleLocationChange()

  // Listener para navegação
  window.addEventListener('popstate', handleLocationChange)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handleLocationChange)
})
</script>

<style scoped></style>
