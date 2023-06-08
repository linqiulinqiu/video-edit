<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import Sublist from "@/components/sublistModel/Sublist.vue";
import MkAudio from "./MkAudio.vue";
export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useSrtStore, ["dirty", "lang_id", "history"]),
  },
  components: {
    Sublist,
    MkAudio,
  },
  methods: {
    async loadSrt() {
      const loading = this.$loading({
        fullscreen: true,
        background: "#9dbfc155",
        text: "加载时间可能很长，请耐心等待。加载中......",
      });
      const res = await this.srtStore.loadSrt();
      console.log("res in loadSrt:", res);
      if (res != undefined) {
        if ("error" in res) {
          loading.close();
          this.$message.error(
            `加载出错了，请刷新后再试。错误原因：${res.error}`
          );
        }
      }

      this.srtStore.loadDone = true;
      loading.close();
    },
    async saveSrt() {
      const loading = this.$loading({
        fullscreen: true,
        background: "#9dbfc155",
        text: "保存中......",
      });
      const res = await this.srtStore.saveSrt();
      console.log("save res", res);
      this.srtStore.loadDone = true;
      loading.close();
      this.$message("保存已完成");
    },
    // undo() {},
    undo() {
      console.log("history", this.history);
      const last = this.history.pop();
      console.log("last history", last);
      this.srtStore.setLines(last.lines);
      this.srtStore.audio = last.audio;
      this.srtStore.setSpks(last.spks);
    },
  },
  data() {
    return {};
  },
};
</script>
<template>
  <el-col>
    <!-- <el-button @click="undo">Undo</el-button> -->
    <el-button v-if="this.history.length > 0" @click="undo">Undo</el-button>
    <el-button @click="loadSrt()">Load</el-button>
    <el-button :disabled="!dirty" @click="saveSrt">Save</el-button>
    <mk-audio v-if="lang_id == 2" />
  </el-col>
</template>