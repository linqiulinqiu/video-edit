<script>
import WaveMap from "./components/WaveMap.vue";
import VideoPlayer from "./components/VideoPlayer.vue";
import EditorStatus from "./components/EditorStatus.vue";
import SublistPanel from "./components/sublistModel/SublistPanel.vue";
import SpeakerList from "./components/SpeakerList.vue";
// import load from "./axios";
export default {
  components: {
    SpeakerList,
    SublistPanel,
    EditorStatus,
    VideoPlayer,
    WaveMap,
  },
  // async mounted() {
  //   const sid = load.getSid();
  //   if (sid) {
  //     console.log("sid=", sid);
  //     // const url = `/subedit/subtitle-info/${sid}`;
  //     const url = "/subedit/subtitle-info/";
  //     const subres = await load.loadInfo(url, sid);
  //     // const subres = await this.axios({
  //     //   method: "get",
  //     //   url: url,
  //     // });
  //     console.log("subinfo", subres.code, subres.data);
  //     const spkres = await this.axios({
  //       method: "get",
  //       url: "/subedit/all-speakers",
  //     });
  //     console.log("spks", spkres.code, spkres.data);
  //   }
  // },
};
</script>

<template>
  <el-container id="container" style="width: 100%">
    <el-main>
      <p>version = <b>0.0.3</b></p>
      <el-tabs>
        <el-tab-pane label="编辑内容">
          <el-row>
            <el-col :span="16" class="sublist">
              <SublistPanel />
            </el-col>
            <el-col :span="8">
              <VideoPlayer video-at="/data/video.mp4" />
            </el-col>
          </el-row>
          <EditorStatus />
          <WaveMap audio-at="/data/audio.mp3" />
        </el-tab-pane>
        <el-tab-pane label="语音设置">
          <SpeakerList />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<style scoped>
.sublist {
  overflow-y: auto;
  height: 500px;
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
.el-tabs {
  height: 800px;
  background-color: #9dbfc1;
}
.el-tabs__header {
  background-color: #9dbfc1;
}
#container {
  text-align: center;
}
.bgcolor {
  background-color: rgb(215, 243, 245);
}
.border {
  border: 1px solid rgb(15, 14, 22);
}
</style>
