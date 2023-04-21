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
  props: ["curIndex", "showGroup", "lines", "cursorPos", "audio", "refLines"],
  watch: {
    showGroup: function (newBool, oldBool) {
      this.operation = newBool;
    },
  },
  data() {
    return {
      operation: this.showGroup,
      isClick: false,
      lineList: this.lines.concat(),
      audiolist: this.audio.concat(),
      reflines: this.refLines.concat(),
      adItem: { len: 0, hash: "" },
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
      }
      return lines;
    },
    delLine() {
      this.lineList.splice(this.curIndex, 1);
      this.srtStore.setLines(this.lineList);
      this.audiolist.splice(this.curIndex, 1);
      this.srtStore.setAudio(this.audiolist);
      this.reflines.splice(this.curIndex, 1);
      this.srtStore.setReflines(this.reflines);
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
      const index = this.curIndex;
      const isOk = this.detectLines();
      if (!isOk) {
        let line = {
          from: this.lines[index].to + 0.01,
          to: "",
          text: "",
          speaker: this.lines[index].speaker,
        };
        if (index == this.lines.length - 1) {
          line.to = this.video.time;
        } else {
          line.to = this.lines[index + 1].from - 0.01;
        }
        this.lineList.splice(index + 1, 0, line);
        this.srtStore.setLines(this.lineList);
        this.audiolist.splice(index + 1, 0, this.adItem);
        this.srtStore.setAudio(this.audiolist);
        this.reflines.splice(index + 1, 0, "");
        this.srtStore.setReflines(this.reflines);
      }
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
        this.audiolist.unshift(this.adItem);
        this.srtStore.setAudio(this.audiolist);
        this.reflines.unshift(""), this.srtStore.setReflines(this.reflines);
      }
    },
    cutToPrev() {
      const cutLines = this.editLines("last");
      this.srtStore.setLines(cutLines);
      const idx = this.curIndex;
      this.audiolist[idx - 1] = this.adItem;
      this.audiolist[idx] = this.adItem;
      this.srtStore.setAudio(this.audiolist);
    },
    cutToNext() {
      const cutLines = this.editLines("next");
      this.srtStore.setLines(cutLines);
      const idx = this.curIndex;
      this.audiolist[idx + 1] = this.adItem;
      this.audiolist[idx] = this.adItem;
      this.srtStore.setAudio(this.audiolist);
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
    <tooltip :content="'向上添加一句'"
      ><el-button
        v-if="curIndex == 0"
        plain
        size="small"
        @click="addLineFirst()"
      >
        <el-icon><DocumentAdd /></el-icon> </el-button
    ></tooltip>
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
    <tooltip :content="'加一句'"
      ><el-button plain size="small" @click="addLine()"
        ><el-icon><Plus /></el-icon></el-button
    ></tooltip>
    <tooltip :content="'关闭'">
      <el-button plain size="small" @click="showGroup = false"
        ><el-icon><Close /></el-icon></el-button
    ></tooltip>
  </el-button-group>
</template>