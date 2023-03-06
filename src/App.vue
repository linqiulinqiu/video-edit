<script setup>
import WaveMap from "./components/WaveMap.vue";
import VideoPlayer from "./components/VideoPlayer.vue";
import EditorStatus from "./components/EditorStatus.vue";
import SublistVue from "./components/sublistModel/Sublist.vue";
</script>

<template>
  <el-container id="container" style="width: 100%">
    <el-main>
      <el-row>
        <el-col :span="16">
          <SublistVue />
        </el-col>
        <el-col :span="8">
          <VideoPlayer video-at="/data/video.mp4" />
        </el-col>
      </el-row>
      <el-row>
        <el-col>
        <EditorStatus />
        <WaveMap audio-at="/data/audio.mp3" srt-at="/data/subtitle.srt" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<style scoped>
.sublist {
  overflow-y: auto;
  height: 600px;
  /* height: calc(100vh - 200px); */
}
.sublist::-webkit-scrollbar {
  background-color: azure;
  width: 5px;
  height: fit-content;
  /* display: none; */
}
.sublist::-webkit-scrollbar-thumb {
  background: rgba(39, 54, 49, 0.514);
  border-radius: 5px;
}
.sublist.el-col::-webkit-scrollbar-track {
  background-color: rgb(124, 179, 160);
  border-radius: 5px;
}

#container {
  background-color: rgb(184, 214, 205);
}
.bgcolor {
  background-color: rgb(215, 243, 245);
}
.border {
  border: 1px solid rgb(15, 14, 22);
}
</style>
