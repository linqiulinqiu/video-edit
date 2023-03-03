<script setup>
import WaveMap from "./components/WaveMap.vue";
import EditorStatus from "./components/EditorStatus.vue";
import SublistVue from "./components/sublistModel/Sublist.vue";
</script>

<template>
  <el-container id="container" style="width: 100%">
    <el-main>
      <el-row justify="space-around">
        <el-col :span="18"><SublistVue /></el-col>
        <el-col class="border" :span="6">
          <h2>video</h2>
        </el-col>
      </el-row>
      <el-col>
        <EditorStatus />
        <WaveMap />
      </el-col>
    </el-main>
  </el-container>
</template>

<style scoped>
#container {
  background-color: rgb(191, 233, 219);
}
.bgcolor {
  background-color: rgb(197, 233, 235);
}
.border {
  border: 1px solid rgb(15, 14, 22);
}
</style>
