<script>
import { mapStores, mapState } from "pinia";
import { useSrtStore } from "@/stores/srt";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine"]),
    ...mapStores(useSrtStore),
  },
  methods: {
    setActiveLine(idx) {
      this.srtStore.activeLine = idx;
      // console.log("set active line =", this.activeLine);
    },
    liClick(index) {
      this.currentIndex = index;
      this.srtStore.activeLine = index;
    },
    print: function (index) {
      console.log("params = ", index);
    },
  },
  data() {
    return {
      currentIndex: this.activeLine,
      isControl: false,
    };
  },
};
</script>
<template>
  <el-col :span="24" :offset="0">
    <ul>
      <li
        @click="liClick(index)"
        :class="{ active: currentIndex == index }"
        v-for="(line, index) in srtStore.lines"
        :key="index"
      >
        <el-row type="flex" :gutter="10">
          <el-col :span="1"
            ><el-icon v-if="index == activeLine"><Right /></el-icon
          ></el-col>
          <el-col :span="3">
            <el-input-number
              v-model="line.from"
              :precision="3"
              step=0.01
              :placeholder="line.from"
              :controls="isControl"
              @blur="this.isControl = true"
              size="small"
            ></el-input-number>
          </el-col>
          <el-col :span="1">----</el-col>
          <el-col :span="3">
            <el-input-number
              v-model="line.to"
              :precision="3"
              step=0.01
              :placeholder="2"
              size="small"
            ></el-input-number>
          </el-col>
          <el-col :span="2">
            <el-button plain size="default" @click="setActiveLine(index)">
              <el-icon size="20"><VideoPlay /></el-icon>
            </el-button>
          </el-col>
          <el-col :span="8">
            <p>{{ line.textEn }}</p>
            <p>{{ line.textZh }}</p>
          </el-col>
        </el-row>
      </li>
    </ul>
  </el-col>
</template>
<style>
.active {
  border: 1px solid rgb(11, 41, 41);
}
</style>