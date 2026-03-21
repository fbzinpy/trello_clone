<template>
  <div>
    <h1>Acerca de</h1>
    <p>Esta es la vista de información del proyecto.</p>

    <InfoCard
      title="Estructura del proyecto"
      description="Organizado en layouts, vistas y componentes para mayor claridad y reutilización."
    />
    <InfoCard
      title="Vue Router"
      description="Maneja la navegación entre vistas usando rutas con layout compartido."
    />
  </div>
</template>

<script setup>
import InfoCard from '../components/InfoCard.vue'
</script>
