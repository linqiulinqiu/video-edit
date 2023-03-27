<script>
import { mapState } from "pinia";
import Tooltip from "../lib/Tooltip.vue";
import { useSrtStore } from "@/stores/srt";
import { useWaveSelStore } from "@/stores/wavesel";
import { mapStores } from "pinia";

export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useWaveSelStore, ["duration"]),
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
      const cutTxt = this.cutString(this.cursorPos, lines[index].text);
      const duration = lines[index].to - lines[index].from;
      const scale = this.cursorPos / lines[index].text.length;
      if (direction == "last") {
        const cutTime = scale * duration;
        lines[index - 1].text = lines[index - 1].text + cutTxt[0];
        lines[index].text = cutTxt[1];
        lines[index - 1].to = lines[index - 1].to + cutTime;
        lines[index].from = lines[index].from - cutTime;
      } else if (direction == "next") {
        const cutTime = (1 - scale) * duration;
        lines[index].text = cutTxt[0];
        lines[index + 1].text = cutTxt[1] + lines[index + 1].text;
        lines[index].to = lines[index].to - cutTime;
        lines[index + 1].from = lines[index + 1].from + cutTime;
      }
      return lines;
    },
    delLine() {
      this.lines.splice(this.curIndex, 1);
      this.srtStore.lines = this.lines;
    },
    detectLines() {
      let isBlank = false;
      for (var i = 0; i < this.lines.length; i++) {
        if (this.lines[i].text == "") {
          isBlank = true;
        }
      }
      if (isBlank) {
        this.$message({
          message: "请先完成空白项的编辑",
          type: "warning",
        });
      }
      console.log("isBlank :", isBlank);
      return isBlank;
    },
    addLine() {
      const index = this.curIndex;
      const isOk = this.detectLines();
      if (!isOk) {
        const line = {
          from: 0.0,
          to: 0.3,
          text: "",
          speaker: "",
        };
        this.lines.splice(index + 1, 0, line);
        this.srtStore.lines = this.lines;
      }
    },
    addLineFirst() {
      const isOk = this.detectLines();
      if (!isOk) {
        const line = {
          from: 0.0,
          to: 0.3,
          text: "",
          speaker: "",
        };
        this.lines.unshift(line);
        this.srtStore.lines = this.lines;

        console.log(this.lines);
      }
    },
    cutToLast() {
      const cutLines = this.editLines("last");
      // this.srtStore.lines = cutLines;
      this.srtStore.setLines(cutLines, this.duration);
      console.log(this.lines);
    },
    cutToNext() {
      const cutLines = this.editLines("next");
      this.srtStore.setLines(cutLines, this.duration);
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
    <el-button v-if="curIndex != 0" plain size="small" @click="cutToLast()"
      ><el-icon><Top /></el-icon
    ></el-button>
    <el-button
      v-if="curIndex != lines.length - 1"
      plain
      size="small"
      @click="cutToNext()"
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