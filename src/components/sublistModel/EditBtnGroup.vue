<script>
import { mapState } from "pinia";
import Tooltip from "../lib/Tooltip.vue";
import { useSrtStore } from "@/stores/srt";
import { mapStores } from "pinia";

export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useSrtStore, ["spks", "video"]),
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
      lineList: this.lines.concat(),
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
      const lines = this.lineList;
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
      } else if (direction == "splite") {
        const cutTime = (1 - scale) * duration;
        lines[index].text = cutTxt[0];
        lines[index].to = lines[index].to - cutTime;
        let line = {
          from: lines[index].to + 0.01,
          to: lines[index].to + 0.01 + cutTime,
          speaker: lines[index].speaker,
          text: cutTxt[1],
        };
        lines.splice(index + 1, 0, line);
      }
      return lines;
    },
    delLine(index) {
      this.lineList.splice(this.curIndex, 1);
      this.srtStore.setLines(this.lineList);
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
      return isBlank;
    },
    addLine() {
      const lines = this.editLines("splite");
      this.srtStore.setLines(lines);
    },
    addLineFirst() {
      const isOk = this.detectLines();
      if (!isOk) {
        const line = {
          from: 0.01,
          to: this.lines[0].from,
          text: "",
          speaker: this.lines[0].speaker,
        };
        this.lineList.unshift(line);
        this.srtStore.setLines(this.lineList);
      }
    },
    cutToPrev() {
      const cutLines = this.editLines("last");
      this.srtStore.setLines(cutLines);
    },
    cutToNext() {
      const cutLines = this.editLines("next");
      this.srtStore.setLines(cutLines);
    },
  },
};
</script>
<template>
  <el-button-group v-show="this.operation">
    <tooltip :content="'删除当前段'">
      <el-button plain size="small" @click="delLine()"
        ><el-icon><Delete /></el-icon
      ></el-button>
    </tooltip>
    <tooltip :content="'向上添加一句'">
      <el-button
        v-if="curIndex == 0"
        plain
        size="small"
        @click="addLineFirst()"
      >
        <el-icon><DocumentAdd /></el-icon>
      </el-button>
    </tooltip>
    <tooltip :content="'向上分割'"
      ><el-button v-if="curIndex != 0" plain size="small" @click="cutToPrev()"
        ><el-icon><Top /></el-icon></el-button
    ></tooltip>
    <tooltip :content="'向下分割'"
      ><el-button
        v-if="curIndex != lines.length - 1"
        plain
        size="small"
        @click="cutToNext()"
        ><el-icon><Bottom /></el-icon></el-button
    ></tooltip>
    <tooltip :content="'从光标位置分割成两句'"
      ><el-button plain size="small" @click="addLine()"
        ><el-icon><Plus /></el-icon></el-button
    ></tooltip>
    <tooltip :content="'关闭'">
      <el-button plain size="small" @click="showGroup = false"
        ><el-icon><Close /></el-icon></el-button
    ></tooltip>
  </el-button-group>
</template>