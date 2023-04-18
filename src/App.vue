<script>
import WaveMap from "./components/WaveMap.vue";
import VideoPlayer from "./components/VideoPlayer.vue";
import EditorStatus from "./components/EditorStatus.vue";
import SublistPanel from "./components/sublistModel/SublistPanel.vue";
import SpeakerList from "./components/SpeakerList.vue";
import { mapStores } from "pinia";
import { useSpStore } from "@/stores/splist";
import { useSrtStore } from "@/stores/srt";
import queryString from "query-string";
import Sublist from "./components/sublistModel/Sublist.vue";
import DemoEdit from "./components/speakerModel/DemoEdit.vue";

export default {
  components: {
    SpeakerList,
    SublistPanel,
    EditorStatus,
    VideoPlayer,
    WaveMap,
    Sublist,
    DemoEdit,
  },
  computed: {
    ...mapStores(useSrtStore, useSpStore),
  },
  mounted() {
    const qs = queryString.parse(location.search);
    if ("sid" in qs) {
      this.srtStore.setSid(parseInt(qs.sid));
    }
    this.spListStore.load();
  },
};
</script>

<template>
  <el-container id="container" style="width: 100%">
    <el-main>
      <p>version = <b>0.0.13</b></p>
      <SublistPanel />
      <el-tabs>
        <el-tab-pane label="编辑内容">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-scrollbar max-height="500px">
                <Sublist />
              </el-scrollbar>
            </el-col>
            <el-col :span="8">
              <VideoPlayer />
            </el-col>
          </el-row>
          <EditorStatus />
          <WaveMap />
        </el-tab-pane>
        <el-tab-pane label="语音设置">
          <SpeakerList />
        </el-tab-pane>
        <el-tab-pane label="示例编辑">
          <DemoEdit />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-tabs {
  height: 800px;
  background-color: #9dbfc100;
}
.el-tabs__header {
  background-color: #9dbfc1ad;
}
#container {
  text-align: center;
  min-width: 1440px;
}
.bgcolor {
  background-color: rgb(215, 243, 245);
}
.border {
  border: 1px solid rgb(15, 14, 22);
}
</style>
