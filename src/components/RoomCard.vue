<template>
  <div class="room-card neon-border">
    <h3 class="room-title glitch">{{ name }}</h3>
    <p class="room-desc">{{ description }}</p>
    <div class="room-footer">
      <span>{{ createdAt }}</span>
      <a href="#" class="join-link">Entrar →</a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  description: String,
  createdAt: String
})
</script>

<style scoped>
.room-card {
  background: var(--color-background-panel);
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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
  margin: 10px 0;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.join-link {
  color: var(--color-neon-cyan);
  text-decoration: none;
}

.join-link:hover {
  text-decoration: underline;
}
</style>
