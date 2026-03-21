<template>
  <div class="info-card">
    <h3 class="info-card__title">{{ title }}</h3>
    <p class="info-card__body">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.info-card {
  background-color: #f4f4f4;
  border-left: 4px solid #42b883;
  border-radius: 6px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
}

.info-card__title {
  margin: 0 0 0.5rem;
  color: #2c3e50;
}

.info-card__body {
  margin: 0;
  color: #555;
}
</style>
