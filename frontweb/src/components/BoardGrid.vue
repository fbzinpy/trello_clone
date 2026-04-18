<template>
  <div>
    <h3 class="section-title">{{ title }}</h3>
    <div class="cards">
      <div
        v-for="board in boards"
        :key="board.id"
        class="card"
        @click="$emit('open', board)"
      >{{ board.name }}</div>
      <div v-if="showAdd" class="card add" @click="$emit('create')">+ Crear nuevo</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:   { type: String, required: true },
  boards:  { type: Array,  required: true },
  showAdd: { type: Boolean, default: false }
})
defineEmits(['open', 'create'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
.section-title { font-size: 1rem; font-weight: 700; color: #172b4d; margin-bottom: 14px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 200px)); gap: 16px; }
.card { height: 110px; background: linear-gradient(135deg,#6366f1 0%,#0052CC 50%,#22c55e 100%); border-radius: 10px; padding: 12px 14px; cursor: pointer; display: flex; align-items: flex-end; font-size: .92rem; font-weight: 700; color: white; box-shadow: 0 2px 8px rgba(0,82,204,.18); transition: .15s; }
.card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,82,204,.22); }
.add { background: white; border: 1.5px solid #e2e8f0; color: #44546f; justify-content: center; align-items: center; box-shadow: none; }
.add:hover { background: #f0f4ff; border-color: #0052CC; color: #0052CC; }
</style>
