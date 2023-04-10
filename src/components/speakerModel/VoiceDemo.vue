<template>
  <el-col>
    <el-col v-if="isPlaying">
      <audio controls :src="this.url"></audio>
      <!-- <el-icon><Operation /></el-icon> -->
    </el-col>
    <el-col v-else>
      <el-icon @click="this.isPlaying = true" size="20"><VideoPlay /></el-icon>
    </el-col>
  </el-col>
</template>

<script>
export default {
  props: ["url"],
  data() {
    // console.log("url :", this.url);
    return {
      isPlaying: false,
    };
  },
};
</script>

<style scoped>
audio {
  width: 200px;
  height: 30px;
}
.el-icon:hover {
  color: aquamarine;
}
</style>