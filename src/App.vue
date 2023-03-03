<script setup>
import WaveMap from "./components/WaveMap.vue";
import EditorStatus from "./components/EditorStatus.vue";
</script>

<template>
  <header>
    <EditorStatus />
  </header>
  <main>
    <WaveMap />
  </main>
</template>

<style scoped>
main {
  min-width: 1024px;
}
</style>
