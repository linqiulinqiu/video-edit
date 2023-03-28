<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useWaveSelStore } from "@/stores/wavesel";
import Sublist from "@/components/sublistModel/Sublist.vue";

export default {
  computed: {
    ...mapState(useWaveSelStore, ["duration"]),
    ...mapStores(useSrtStore),
  },
  components: {
    Sublist,
  },
  methods: {
    async loadSrt() {
      await this.srtStore.loadSrt(this.duration);
    },
  },
};
</script>
<template>
  <el-col>
    <!-- <el-col?> -->
    <el-button @click="loadSrt()">Load</el-button>
    <!-- </el-col?> -->
    <Sublist />
  </el-col>
</template>