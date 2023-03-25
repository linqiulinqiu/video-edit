<script>
import { mapState } from "pinia";
import { useSpStore } from "@/stores/splist";
export default {
  props: ["val", "idx"],
  computed: { ...mapState(useSpStore, ["speakers", "speakerList"]) },
  methods: {
    setSpeaker(value, idx) {
      this.speakerList[idx] = value;
      this.speakerList = [...this.speakerList];
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
      :placeholder="speakers[this.val].name"
      :value="this.val"
      @change="
        (v) => {
          setSpeaker(v, this.idx);
        }
      "
    >
      <el-option
        v-for="item in speakers"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
  </el-popover>
</template>