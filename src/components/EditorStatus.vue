<script>
import { mapStores } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { usePlayerStore } from "@/stores/player";
import { useSrtStore } from "@/stores/srt";

export default {
  computed: {
    pos() {
      if (this.waveSelStore.pos) return this.waveSelStore.pos;
      if (this.playerStore.pos) return this.playerStore.pos;
      return 0;
    },
    ...mapStores(useWaveSelStore, usePlayerStore, useSrtStore),
  },
};
</script>

<template>
  <el-row>
    <el-col :span="2" class="editState">
      <el-text>
        {{ pos.toFixed(2) }}/{{ waveSelStore.duration.toFixed(2) }}
      </el-text>
    </el-col>
    <el-col :span="5" class="editState">
      <el-text v-if="srtStore.activeLine >= 0">
        {{ srtStore.activeLine }}/{{ srtStore.lines.length }}
      </el-text>
      <el-text v-else>{{ srtStore.lines.length }}</el-text>
    </el-col>
  </el-row>
</template>
<style scoped>
.el-col.editState {
  border-radius: 5px;
  background-color: cadetblue;
}
.el-text {
  color: black;
}
</style>