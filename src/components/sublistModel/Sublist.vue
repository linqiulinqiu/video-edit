<script>
import { mapStores, mapState } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useWaveSelStore } from "@/stores/wavesel";
import EditBtnGroupVue from "./EditBtnGroup.vue";
import TimePickerVue from "./TimePicker.vue";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine", "lines", "spks"]),
    ...mapState(useWaveSelStore, ["duration"]),
    ...mapStores(useSrtStore),
  },
  components: {
    EditBtnGroupVue,
    TimePickerVue,
  },
  methods: {
    format(seconds) {
      let hour =
        Math.floor(seconds / 3600) >= 10
          ? Math.floor(seconds / 3600)
          : "0" + Math.floor(seconds / 3600);
      seconds -= 3600 * hour;
      let min =
        Math.floor(seconds / 60) >= 10
          ? Math.floor(seconds / 60)
          : "0" + Math.floor(seconds / 60);
      seconds -= 60 * min;
      let sec = seconds >= 10 ? seconds : "0" + seconds;
      return hour + ":" + min + ":" + sec;
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
      this.srtStore.setLines(lines);
    },
    textFocus() {
      this.showGroup = true;
    },
    textSelect(event) {
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
        :key="line.text"
      >
        <el-row>
          <el-col :span="1">
            <el-icon v-if="index == currentIndex"><Right /></el-icon>
            <span>{{ index + 1 }}</span>
          </el-col>
          <el-col :span="2">
            <el-select
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
                :key="index"
                :label="item.name"
                :value="index"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input-number
              :model-value="line.from"
              :precision="2"
              :step="0.01"
              :min="line.min"
              :max="line.to"
              @input="edgeUpdate(index)"
              :placeholder="line.from.toString()"
              size="small"
            ></el-input-number>
            <!-- <span>start:{{ format(line.from) }}</span> -->
          </el-col>
          <el-col :span="1">-----</el-col>
          <el-col :span="3">
            <el-input-number
              :model-value="line.to"
              :precision="2"
              :min="line.from"
              :max="line.max"
              @input="edgeUpdate(index)"
              :step="0.01"
              :placeholder="line.to.toString()"
              size="small"
            ></el-input-number>
            <!-- <span>end:{{ format(line.to) }}</span> -->
          </el-col>
          <el-col :span="2">
            <el-button plain size="default" @click="playVideo(index)">
              <el-icon size="20"><VideoPlay /></el-icon>
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-input
              type="textarea"
              @focus="textFocus()"
              v-model="line.text"
              @click="textSelect($event)"
            />
          </el-col>
          <el-col class="btn-group" v-if="index == currentIndex">
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
  border: 1px solid rgb(54, 92, 85);
  border-radius: 10px;
  background-color: #235862ab;
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