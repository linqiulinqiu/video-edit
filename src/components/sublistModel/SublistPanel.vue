<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import Sublist from "@/components/sublistModel/Sublist.vue";
import MkAudio from "./MkAudio.vue";
export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useSrtStore, ["dirty"])
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
        text: "加载中......",
      });
      await this.srtStore.loadSrt();
      loading.close();
    },
    async saveSrt() {
      await this.srtStore.saveSrt();
    },
  },
  data() {
    return {
      making: false,
      percent_stage: 0,
    };
  },
};
</script>
<template>
  <el-col v-if="!making">
    <el-button @click="loadSrt()">Load</el-button>
    <el-button :disabled="!dirty" @click="saveSrt()">Save</el-button>
    <mk-audio />
  </el-col>
</template>