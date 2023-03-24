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
      this.srtStore.loadSrt(name, this.duration);
    },
  },
};
</script>
<template>
  <el-col :span="24" :offset="0">
    <el-col>
      <el-button @click="loadSrt('/subedit/subtitle-info/')">MS中文</el-button>
      <!-- <el-button @click="loadSrt('subtitle-en')">GPT英文</el-button> -->
      <!-- <el-button @click="loadSrt('subtitle-zh')">GPT中文</el-button> -->
    </el-col>
    <Sublist />
  </el-col>
</template>