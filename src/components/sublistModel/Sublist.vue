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
    <ul :spna="24">
      <li
        @click="liClick(index)"
        :class="{ active: currentIndex == index }"
        v-for="(line, index) in srtStore.lines"
        :key="index"
      >
        <el-row>
          <el-col :span="1">
            <el-icon v-if="index == activeLine"><Right /></el-icon>
          </el-col>
          <el-col :span="3">
            <el-input-number
              v-model="line.from"
              :precision="2"
              :step="0.01"
              :placeholder="line.from.toString()"
              :controls="isControl"
              @blur="this.isControl = true"
              size="small"
            ></el-input-number>
          </el-col>
          <el-col :span="1">----</el-col>
          <el-col :span="3">
            <el-input-number
              v-model="line.to"
              :precision="2"
              :step="0.01"
              :placeholder="line.to.toString()"
              size="small"
            ></el-input-number>
          </el-col>
          <el-col :span="2">
            <el-button plain size="default" @click="setActiveLine(index)">
              <el-icon size="20"><VideoPlay /></el-icon>
            </el-button>
          </el-col>
          <el-col :span="14">
            <p>{{ line.textEn }}</p>
            <p>{{ line.textZh }}</p>
          </el-col>
        </el-row>
      </li>
    </ul>
  </el-col>
</template>
<style scoped>
.active {
  border: 1px solid rgb(54, 92, 85);
  border-radius: 10px;
  background-color: rgb(154, 199, 201);
}
ul {
  padding-inline-start: 0px !important;
}
ul li {
  text-align: center;
  padding: 10px 10px;
}
</style>