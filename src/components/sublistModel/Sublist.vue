<script>
import { mapStores, mapState } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useWaveSelStore } from "@/stores/wavesel";
import EditBtnGroupVue from "./EditBtnGroup.vue";
import TimePickerVue from "./TimePicker.vue";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine", "lines", "spks","audioOut"]),
    ...mapState(useWaveSelStore, ["duration"]),
    ...mapStores(useSrtStore),
  },
  components: {
    EditBtnGroupVue,
    TimePickerVue,
  },
  methods: {
    setLine(idx,val){
      this.srtStore.setLine(idx, val)
    },
    playVideo(idx) {
      this.srtStore.activeLine = idx;
      this.isPlay != this.isPlay;
    },
    liClick(index) {
      this.currentIndex = index;
      this.srtStore.activeLine = index;
    },
    setTalker(val, index) {
      // this.lines[index].speaker = val;
      console.log(" set taller", val, index);
      const lines = this.lines.concat();
      lines[index].speaker = val;
      console.log("lines", lines);
      this.srtStore.setLines(lines);
    },
    textFocus() {
      this.showGroup = true;
    },
    textSelect(event) {
      this.showGroup = true;
      const objArea = event.target;
      this.cursorPos = objArea.selectionStart;
    },
    edgeUpdate(index) {
      const line = this.lines[index];
      let fixed = false;
      if (index <= 0) {
        if (line.from < 0) {
          line.from = 0;
          fixed = true;
        }
      } else if (line.from < this.lines[index - 1].to) {
        line.from = this.lines[index - 1].to;
        fixed = true;
      }
      const duration = this.duration;
      if (index >= this.lines.length) {
        console.log("enter");

        if (line.to >= duration) {
          line.to = duration;
          fixed = true;
        }
      } else if (line.to > this.lines[index + 1].from) {
        line.to = this.lines[index + 1].from;
        fixed = true;
      } else {
        console.log("line.to = ", line.to, this.lines[index + 1].from);
      }
      this.srtStore.setLines(this.lines);
      if (fixed) {
        console.log("fixed line", index, this.lines);
        this.$forceUpdate();
      }
    },
    modifyText(text, idx) {
      console.log("modify text : ", text, "idx = ", idx, this.lines[idx].text);
    },
  },
  data() {
    return {
      currentIndex: this.activeLine,
      isControl: false,
      showGroup: false,
      cursorPos: 0,
      isPlay: false,
    };
  },
  watch: {
    activeLine: function (newL, oldL) {
      this.currentIndex = newL;
    },
  },
};
</script>
<template>
  <el-col>
    <ul :span="24">
      <li
        @click="liClick(index)"
        :class="{ active: currentIndex == index }"
        v-for="(line, index) in lines"
        :key="line"
      >
        <el-row>
          <el-col :span="1">
            <el-icon v-if="index == currentIndex"><Right /></el-icon>
            <span>{{ index + 1 }}</span>
          </el-col>
          <el-col v-if="audioOut">
            <audio v-if="index == currentIndex">
              <source :src="'/subtitles/audio-out/'+srtStore.sid+'?cid='+index" type="audio/mpeg">
            </audio>
          </el-col>
          <el-col :span="2">
            <el-select
              size="small"
              :model-value="line.speaker"
              @change="
                (v) => {
                  setTalker(v, index);
                }
              "
            >
              <el-option
                v-for="(item, index) in spks"
                :key="index"
                :value="index"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <time-picker-vue :value="line" @update:model-value="setLine(index, $event)"/>
          </el-col>
          <el-col :span="2">
            <el-button plain size="default" @click="playVideo(index)">
              <el-icon size="20"><VideoPlay /></el-icon>
            </el-button>
          </el-col>
          <el-col :span="10">
            <el-input
              type="textarea"
              @focus="this.showGroup = true"
              v-model="lines[index].text"
              autofocus="true"
              @click="textSelect($event)"
            />
          </el-col>
          <el-col
            :span="5"
            :offset="19"
            class="btn-group"
            v-if="index == currentIndex"
          >
            <EditBtnGroupVue
              :curIndex="index"
              :cursorPos="cursorPos"
              :lines="lines"
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
  /* border: 1px solid rgb(54, 92, 85); */
  border-radius: 10px;
  background-color: #36727eab;
}
ul {
  padding-inline-start: 0px !important;
}
ul li {
  text-align: center;
  padding: 10px 10px;
  position: relative;
}
ul li:hover {
  /* border: 1px solid rgb(54, 92, 85); */
  border-radius: 10px;
  background-color: #377885ab;
}
.btn-group.el-col {
  position: absolute;
  width: 200px;
  height: 50px;
  right: 20px;
  top: -23px;
  /* background-color: aqua; */
}
</style>