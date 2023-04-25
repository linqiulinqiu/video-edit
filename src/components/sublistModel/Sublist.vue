<script>
import { mapStores, mapState } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useWaveSelStore } from "@/stores/wavesel";
import EditBtnGroupVue from "./EditBtnGroup.vue";
import TimePickerVue from "./TimePicker.vue";
import MakevoiceBtn from "../lib/MakevoiceBtn.vue";
export default {
  computed: {
    ...mapState(useSrtStore, [
      "activeLine",
      "lines",
      "spks",
      "sid",
      "audio",
      "reflines",
    ]),
    ...mapState(useWaveSelStore, ["duration"]),
    ...mapStores(useSrtStore),
    overlaps() {
      const ols = [];
      var audioLens = [];
      for (let i in this.audio) {
        audioLens.push(this.audio[i].len);
      }
      const lines = this.lines;
      for (let i in audioLens) {
        if (i in lines) {
          const durationMs = (lines[i].to - lines[i].from) * 1000;
          // overlap "unknown", "ok", "overlap"
          if (audioLens.length <= i || audioLens[i] == 0) {
            ols.push(-1);
          } else {
            const overlap = (audioLens[i] - durationMs) / 1000;
            if (overlap > 0) {
              const over = Math.ceil(overlap * 100) / 100;
              ols.push(over);
            } else {
              ols.push(0);
            }
          }
        }
      }
      return ols;
    },
    audioSrc() {
      var srcArr = [];
      for (let i in this.audio) {
        const hash = this.audio[i].hash;
        const src = "/storage/tts/cache/" + hash + ".mp3";
        srcArr.push(src);
      }
      return srcArr;
    },
  },
  components: {
    EditBtnGroupVue,
    TimePickerVue,
    MakevoiceBtn,
  },
  methods: {
    setLine(idx, val) {
      this.srtStore.setLine(idx, val);
    },
    liClick(index) {
      this.srtStore.activeLine = index;
    },
    setTalker(val, index) {
      const lines = this.lines.concat();
      let line = lines[index];
      line.speaker = val;
      this.setLine(index, line);
    },
    textFocus() {
      this.showGroup = true;
    },
    textSelect(event) {
      this.showGroup = true;
      const objArea = event.target;
      this.cursorPos = objArea.selectionStart;
    },
    modifyText(text, idx) {
      const line = this.lines[idx];
      line.text = text;
      this.setLine(idx, line);
    },
  },
  data() {
    return {
      currentIndex: this.activeLine,
      showGroup: false,
      cursorPos: 0,
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
    <ul :span="24" class="linelist">
      <li
        @click="liClick(index)"
        :class="{ active: currentIndex == index }"
        v-for="(line, index) in lines"
        :key="index"
      >
        <el-row class="list-title">
          <el-col :span="1">
            <el-text type="primary" size="large">
              <el-icon v-if="index == currentIndex"><Right /></el-icon>
              <span v-else>{{ index + 1 }}</span>
            </el-text>
          </el-col>
          <el-col :span="20">
            <el-col v-if="audio[index].len > 0">
              <audio
                controls
                v-if="index == currentIndex"
                :src="audioSrc[index]"
              />
              <el-text type="danger" v-if="overlaps[index]">
                Overlap : {{ overlaps[index] }}s
              </el-text>
            </el-col>
            <el-col v-else>
              <el-text type="warning" v-if="overlaps[index] == '-1'">
                Overlap : unknown
              </el-text>
            </el-col>
          </el-col>
        </el-row>

        <el-row class="list-oprate">
          <el-col :span="3">
            <el-select
              class="m-top"
              size="small"
              :model-value="spks[line.speaker].name"
              @change="
                (v) => {
                  setTalker(v, index);
                }
              "
            >
              <el-option
                v-for="(item, index) in spks"
                :key="item.name"
                :value="index"
                :label="index + ' -- ' + item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <time-picker-vue
              :value="line"
              @update:model-value="setLine(index, $event)"
            />
          </el-col>
          <!-- <el-col :span="1">
            <el-button
              class="m-top btn-play"
              plain
              circle
              size="small"
              @click="playVideo(index)"
            >
              <el-icon size="20"><VideoPlay /></el-icon>
            </el-button>
          </el-col> -->
          <el-col :span="13">
            <el-col>
              <el-input
                type="textarea"
                @focus="this.showGroup = true"
                :model-value="line.text"
                :autosize="{ minRows: 1, maxRows: 5 }"
                autofocus="true"
                @click="textSelect($event)"
                @input="modifyText($event, index)"
              />
            </el-col>

            <el-text size="small">{{ reflines[index] }}</el-text>
          </el-col>
          <el-col class="btn-group" v-if="index == currentIndex">
            <EditBtnGroupVue
              :curIndex="index"
              :cursorPos="cursorPos"
              :lines="lines"
              :showGroup="showGroup"
              :audio="audio"
              :refLines="reflines"
            />
          </el-col>
        </el-row>
      </li>
    </ul>
  </el-col>
</template>
<style scoped>
.mv-btn {
  float: right;
}
.sid {
  margin-top: px;
}
.btn-play.el-button {
  padding: 5px;
  background-color: #ffffff1f;
}
.active {
  border-radius: 10px;
  background-color: #36727e9c;
}

ul.linelist {
  padding-inline-start: 0px !important;
}
ul.linelist li {
  text-align: center;
  padding: 10px;
  position: relative;
  margin-top: 25px;
  border: 1px solid #377885ab;
  border-radius: 20px;
}
ul li:not(.active):hover {
  border-radius: 20px;
  background-color: #37788528;
}
.list-oprate {
  padding-top: 10px;
}
/* .list-oprate > .el-col > .el-select {
  top: -10px;
} */
.list-oprate > .el-col:nth-child(3) {
  padding-right: 5px;
}
.btn-group.el-col {
  position: absolute;
  width: 200px;
  right: 0px;
  top: -15px;
}
.list-title {
  border-radius: 5px;
  background: #1d5d68;
}
</style>