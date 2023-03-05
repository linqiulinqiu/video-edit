<script setup>
import WaveMap from "./components/WaveMap.vue";
import VideoPlayer from './components/VideoPlayer.vue';
import EditorStatus from "./components/EditorStatus.vue";
import SublistVue from "./components/sublistModel/Sublist.vue";
</script>

<template>
  <el-container id="container" style="width: 100%">
    <el-main>
      <el-row justify="space-around">
        <el-col :span="15"><SublistVue /></el-col>
        <el-col class="border" :span="8">
          <VideoPlayer video-at="data/video.mp4" />
        </el-col>
      </el-row>
      <el-col>
        <EditorStatus />
        <WaveMap audio-at="/data/audio.mp3" srt-at="/data/subtitle.srt" />
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
