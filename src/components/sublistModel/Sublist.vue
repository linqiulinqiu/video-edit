<script>
import { mapStores, mapState } from "pinia";
import { useSrtStore } from "@/stores/srt";
import EditBtnGroupVue from "./EditBtnGroup.vue";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine"]),
    ...mapStores(useSrtStore),
  },
  components: {
    EditBtnGroupVue,
  },
  methods: {
    setActiveLine(idx) {
      this.srtStore.activeLine = idx;
    },
    liClick(index) {
      this.currentIndex = index;
      this.srtStore.activeLine = index;
    },
    textFocus() {
      this.showGroup = true;
    },
    textSelect(event) {
      const objArea = event.target;
      this.cursorPos = objArea.selectionStart;
    },
  },
  data() {
    return {
      currentIndex: this.activeLine,
      isControl: false,
      showGroup: false,
      cursorPos: 0,
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
            <span>{{ index + 1 }}</span>
            <el-icon v-if="index == activeLine"><Right /></el-icon>
          </el-col>
          <el-col :span="3">
            <el-input-number
              v-model="line.from"
              :precision="2"
              :step="0.01"
              :placeholder="line.from.toString()"
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
            <el-input
              type="textarea"
              @focus="textFocus()"
              v-model="line.textZh"
              @click="textSelect($event)"
            />
          </el-col>
          <el-col class="btn-group" v-if="index == activeLine">
            <EditBtnGroupVue
              :curIndex="index"
              :cursorPos="cursorPos"
              :lines="srtStore.lines"
              :showGroup="showGroup"
            />
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
  position: relative;
}
.btn-grounp {
  position: absolute;
  width: 200px;
  height: 50px;
}
</style>