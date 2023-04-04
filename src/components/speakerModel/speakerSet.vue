<script>
import { mapState, mapStores } from "pinia";
import { useSpStore } from "@/stores/splist";
import { useSrtStore } from "@/stores/srt";
export default {
  props: ["spks", "idx"],
  computed: {
    ...mapState(useSpStore, ["speakerList"]),
    ...mapStores(useSrtStore),
  },

  methods: {
    setSpeaker(value, idx) {
      this.spks[this.idx].speaker_id = value;
      this.srtStore.setSpks(this.spks);
    },
  },
};
</script>

<template>
  <el-popover trigger="click" placement="right" :width="200">
    <template #reference>
      <el-button circle size="small">
        <el-icon><Setting /></el-icon>
      </el-button>
    </template>
    <el-select
      size="small"
      :model-value="spks[this.idx].speaker_id"
      @change="
        (v) => {
          setSpeaker(v, this.idx);
        }
      "
    >
      <el-option
        v-for="item in speakerList"
        :key="item.id"
        :label="item.name + '--' + item.gender"
        :value="item.id"
      ></el-option>
    </el-select>
  </el-popover>
</template>