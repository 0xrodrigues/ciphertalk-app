<template>
  <div class="feature-card neon-border">
    <div class="feature-icon">{{ icon }}</div>
    <h3 class="glitch">{{ title }}</h3>
    <p>{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  desc: String
})
</script>

<style scoped>
.feature-card {
  background: var(--color-background-panel);
  border-radius: 12px;
  padding: 20px;
  color: var(--color-text-primary);
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--color-neon-cyan);
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
