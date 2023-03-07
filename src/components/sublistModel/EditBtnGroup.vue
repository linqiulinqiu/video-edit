<script>
import Tooltip from "../lib/Tooltip.vue";
import { useSrtStore } from "@/stores/srt";
import { mapStores } from "pinia";

export default {
  computed: {
    ...mapStores(useSrtStore),
  },
  components: {
    Tooltip,
  },
  props: ["curIndex", "showGroup", "lines", "cursorPos"],
  watch: {
    showGroup: function (newBool, oldBool) {
      this.operation = newBool;
    },
  },
  data() {
    return {
      operation: this.showGroup,
      isClick: false,
    };
  },
  methods: {
    cutString(pos, cutTxt) {
      const first = cutTxt.slice(0, pos);
      const second = cutTxt.slice(pos);
      return [first, second];
    },
    editLines(direction) {
      const index = this.curIndex;
      const lines = this.lines;
      const cutTxt = this.cutString(this.cursorPos, this.lines[index].textZh);
      if (direction == "last") {
        lines[index - 1].textZh = lines[index - 1].textZh + cutTxt[0];
        lines[index].textZh = cutTxt[1];
      } else if (direction == "next") {
        lines[index].textZh = cutTxt[0];
        lines[index + 1].textZh = cutTxt[1] + lines[index + 1].textZh;
      }
      return lines;
    },
    delLine() {
      this.lines.splice(this.curIndex, 1);
      this.srtStore.lines = this.lines;
    },
    addLine() {
      const index = this.curIndex;
      if (
        this.lines[index + 1].textEn == "" ||
        this.lines[index + 1].textZh == ""
      ) {
        this.$message({
          message: "请完成当前项的编辑",
          type: "warning",
        });
      } else {
        const line = {
          from: 0.0,
          to: 0.3,
          textZh: "",
          textEn: "",
          speaker: "",
        };
        this.lines.splice(index + 1, 0, line);
        this.srtStore.lines = this.lines;
      }
    },
    addLineFirst() {
      if (this.lines[0].textEn == "" || this.lines.textZh == "") {
        this.$message({
          message: "请完成当前项的编辑",
          type: "warning",
        });
      } else {
        const line = {
          from: 0.0,
          to: 0.3,
          textZh: "",
          textEn: "",
          speaker: "",
        };
        this.lines.unshift(line);
        this.srtStore.lines = this.lines;

        console.log(this.lines);
      }
    },
    cutToLast() {
      const cutLines = this.editLines("last");
      this.srtStore.lines = cutLines;
      console.log(this.lines);
    },
    cutToNext() {
      this.srtStore.lines = this.editLines("next");
    },
  },
};
</script>
<template>
  <el-button-group v-show="this.operation">
    <tooltip :content="'删除当前段'">
      <el-button plain size="small" @click="delLine()"
        ><el-icon><Delete /></el-icon></el-button
    ></tooltip>
    <el-button v-if="curIndex == 0" plain size="small" @click="addLineFirst()">
      <el-icon><DocumentAdd /></el-icon>
    </el-button>
    <el-button plain size="small" @click="cutToLast()"
      ><el-icon><Top /></el-icon
    ></el-button>
    <el-button plain size="small" @click="cutToNext()"
      ><el-icon><Bottom /></el-icon
    ></el-button>
    <el-button plain size="small" @click="addLine()"
      ><el-icon><Plus /></el-icon
    ></el-button>
    <el-button plain size="small" @click="showGroup = false"
      ><el-icon><Close /></el-icon
    ></el-button>
  </el-button-group>
</template>