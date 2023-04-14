<script>
import { mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import Sublist from "@/components/sublistModel/Sublist.vue";

export default {
  computed: {
    ...mapStores(useSrtStore),
    percent() {
      return this.percent_stage;
    },
  },
  components: {
    Sublist,
  },
  methods: {
    async loadSrt() {
      await this.srtStore.loadSrt();
    },
    async saveSrt() {
      await this.srtStore.saveSrt();
    },
    async makeAudio() {
      console.log("TODO: make audio");
      // alert("TODO: make audio");
      const loading = this.$loading({
        fullscreen: true,
        background: "#9dbfc1ad",
        text: "视频生成中",
        lock: true,
      });
      this.isMake = true;
      const obj = this;
      const per = setInterval(function () {
        obj.percent_stage += 1;
        // console.log("percent", obj.percent);
      }, 100);
      setTimeout(() => {
        loading.close();
        clearInterval(per);
        obj.isMake = false;
      }, 10000);
    },
  },
  data() {
    return {
      isMake: false,
      percent_stage: 0,
    };
  },
};
</script>
<template>
  <el-col v-if="!isMake">
    <el-button @click="loadSrt()">Load</el-button>
    <el-button @click="saveSrt()">Save</el-button>
    <el-button v-if="srtStore.audioOut == false" @click="makeAudio">
      Make Audio
    </el-button>
    <!-- <el-button @click="makeAudio">生成视频</el-button> -->
  </el-col>
  <el-col v-else>
    <!-- <el-loading></el-loading> -->
    <el-progress type="circle" :percentage="percent" />
  </el-col>
</template>