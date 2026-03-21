<template>
  <div>
    <h1>Bienvenido</h1>
    <p>Esta es la vista de inicio.</p>

    <InfoCard
      title="Vue 3"
      description="Un framework progresivo para construir interfaces de usuario."
    />
    <InfoCard
      title="Composition API"
      description="Organiza la lógica de tu componente con setup(), ref y reactive."
    />
  </div>
</template>

<script setup>
import InfoCard from '../components/InfoCard.vue'
</script>
