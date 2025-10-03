<template>
  <Home v-if="currentPage === 'home'" />
  <CreateRoom v-else-if="currentPage === 'create-room'" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Home from './pages/Home.vue'
import CreateRoom from './pages/CreateRoom.vue'

const currentPage = ref('home')

const handleLocationChange = () => {
  const path = window.location.pathname
  if (path === '/create-room') {
    currentPage.value = 'create-room'
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
