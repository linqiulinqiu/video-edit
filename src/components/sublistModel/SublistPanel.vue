<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import Sublist from "@/components/sublistModel/Sublist.vue";
import MkAudio from "./MkAudio.vue";
export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useSrtStore, ["dirty", "lang_id"]),
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
      await this.srtStore.loadSrt();
      this.srtStore.loadDone = true;
      loading.close();
    },
    async saveSrt() {
      await this.srtStore.saveSrt();
    },
  },
  data() {
    return {};
  },
};
</script>
<template>
  <el-col>
    <el-button @click="loadSrt()">Load</el-button>
    <el-button :disabled="!dirty" @click="saveSrt()">Save</el-button>
    <mk-audio v-if="lang_id == 2" />
  </el-col>
</template>