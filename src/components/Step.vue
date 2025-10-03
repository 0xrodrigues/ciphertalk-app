<template>
  <div class="step-container">
    <div class="step-number">{{ n }}</div>
    <div>
      <p class="step-title glitch">{{ title }}</p>
      <p class="step-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  n: Number,
  title: String,
  text: String
})
</script>

<style scoped>
.step-container {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-neon-pink), var(--color-neon-cyan));
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step-title {
  font-size: 16px;
  margin: 0;
}

.step-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}
</style>
