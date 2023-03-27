<script>
import { mapStores, mapState } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useWaveSelStore } from "@/stores/wavesel";
import EditBtnGroupVue from "./EditBtnGroup.vue";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine", "lines", "spks"]),
    ...mapState(useWaveSelStore, ["duration"]),
    ...mapStores(useSrtStore),
  },
  components: {
    EditBtnGroupVue,
  },
  methods: {
    playVideo(idx) {
      this.srtStore.activeLine = idx;
      this.isPlay != this.isPlay;
    },
    liClick(index) {
      this.currentIndex = index;
      this.srtStore.activeLine = index;
    },
    setTalker(val, index) {
      console.log("set Talker,", val, index);
      this.lines[index].speaker = val;
    },
    textFocus() {
      this.showGroup = true;
    },
    textSelect(event) {
      const objArea = event.target;
      this.cursorPos = objArea.selectionStart;
    },
    edgeUpdate(index) {
      const lines = this.srtStore.lines;
      const line = lines[index];
      let fixed = false;
      if (index <= 0) {
        if (line.from < 0) {
          line.from = 0;
          fixed = true;
        }
      } else if (line.from < lines[index - 1].to) {
        line.from = lines[index - 1].to;
        fixed = true;
      }
      const duration = this.duration;
      if (index >= lines.length) {
        console.log("enter");

        if (line.to >= duration) {
          line.to = duration;
          fixed = true;
        }
      } else if (line.to > lines[index + 1].from) {
        line.to = lines[index + 1].from;
        fixed = true;
      } else {
        console.log("line.to = ", line.to, lines[index + 1].from);
      }
      this.srtStore.setLines(lines, duration);
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
      console.log("current Index = ", newL);
    },
  },
};
</script>
<template>
  <ul :spna="24">
    <li
      @click="liClick(index)"
      :class="{ active: currentIndex == index }"
      v-for="(line, index) in lines"
      :key="index"
    >
      <el-row>
        <el-col :span="1">
          <el-icon v-if="index == currentIndex"><Right /></el-icon>
          <span>{{ index + 1 }}</span>
        </el-col>
        <el-col :span="2">
          <el-select
            size="small"
            v-model="line.speaker"
            @change="
              (v) => {
                setTalker(v, index);
              }
            "
          >
            <el-option
              v-for="item in spks"
              :key="item.speaker_id"
              :label="item.speaker_id"
              :value="item.speaker_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input-number
            v-model="line.from"
            :precision="2"
            :step="0.01"
            :min="line.min"
            :max="line.to"
            @input="edgeUpdate(index)"
            :placeholder="line.from.toString()"
            size="small"
          ></el-input-number>
        </el-col>
        <el-col :span="1">-----</el-col>
        <el-col :span="3">
          <el-input-number
            v-model="line.to"
            :precision="2"
            :min="line.from"
            :max="line.max"
            @input="edgeUpdate(index)"
            :step="0.01"
            :placeholder="line.to.toString()"
            size="small"
          ></el-input-number>
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
            :lines="srtStore.lines"
            :showGroup="showGroup"
          />
        </el-col>
      </el-row>
    </li>
  </ul>
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