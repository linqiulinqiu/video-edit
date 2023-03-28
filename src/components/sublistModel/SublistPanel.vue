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
    loadSrt(name) {
      this.srtStore.loadSrt(this.duration);
    },
  },
};
</script>
<template>
  <el-col :span="24" :offset="0">
    <el-col v-if="this.srtStore.lines.length == 0">
      <el-button @click="loadSrt()">Load</el-button>
    </el-col>
    <Sublist v-else />
  </el-col>
</template>