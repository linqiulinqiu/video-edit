
<script>
export default {
  props: ["value"],
  emits: ["update:modelValue"],
  computed: {
    from() {
      return this.formTime(this.value.from * 1000);
    },
    to() {
      return this.formTime(this.value.to * 1000);
    },
  },
  data() {
    return {
      min: this.formTime(this.value.min * 1000),
      max: this.formTime(this.value.max * 1000),
      fromlimit: {
        hh: [],
        mm: [],
        ss: [],
        // ms: [],
      },
      tolimit: {
        hh: [],
        mm: [],
        ss: [],
        // ms: [],
      },
    };
  },
  mounted() {
    if (this.value != "") {
      this.getRange();
    }
  },

  methods: {
    time_hms(time) {
      const hh = time.getHours();
      const mm = time.getMinutes();
      const ss = time.getSeconds();
      // const ms = time.getMilliseconds();
      return [hh, mm, ss];
    },
    makeRange(range) {
      if (range[0] < range[1]) {
        let rangeArr = [];
        for (let i = range[0]; i <= range[1]; i++) {
          rangeArr.push(i);
        }
        return rangeArr;
      } else {
        return [0];
      }
    },
    time_range(min, max, timeLimit) {
      const idxArr = Object.keys(timeLimit);
      for (let item in timeLimit) {
        if (timeLimit.hasOwnProperty(item)) {
          const idx = idxArr.indexOf(item);
          if (idx != -1) {
            // timeLimit[item] = this.makeRange(min[idx], max[idx]);
            timeLimit = [min[idx], max[idx]];
          }
        }
      }
      return timeLimit;
    },
    getRange() {
      const minR = this.time_hms(this.min);
      const lFrom = this.time_hms(this.to);
      const lTo = this.time_hms(this.from);
      const maxR = this.time_hms(this.max);
      this.time_range(minR, lFrom, this.fromlimit);
      this.time_range(lTo, maxR, this.tolimit);
    },
    incrTime(isFrom, sec) {
      this.getRange();
      if (isFrom) {
        this.value.from += sec;
      } else {
        this.value.to += sec;
      }
      this.$emit("update:modelValue", this.value);
    },
    setTime(isFrom, time) {
      const offset = time.getTimezoneOffset() * 60;
      const sec = time.getTime() / 1000 - offset;
      if (isFrom) {
        this.value.from = sec;
      } else {
        this.value.to = sec;
      }
      this.$emit("update:modelValue", this.value);
    },
    formTime(time) {
      //time is millisecondes
      const d = new Date(this.value.from * 1000);
      const offset = d.getTimezoneOffset() * 60 * 1000;
      const time_obj = new Date(time + offset);
      return time_obj;
    },
  },
};
</script>
<template>
  <el-col>
    <el-row>
      <el-col :span="11">
        <el-row>
          <el-col :span="5">
            <el-button class="comp-btn" @click="incrTime(true, 0.01)"
              >+
            </el-button>
            <el-button class="comp-btn" @click="incrTime(true, -0.01)"
              >-
            </el-button>
          </el-col>
          <el-col :span="19"
            ><el-time-picker
              class="pick-time m-top"
              v-model="from"
              size="small"
              :default-value="from"
              format="H:mm:ss:SSS"
              @change="setTime(true, this.from)"
          /></el-col>
        </el-row>
      </el-col>
      <el-col :span="2" class="m-top"> -> </el-col>
      <el-col :span="11">
        <el-row>
          <el-col :span="19">
            <el-time-picker
              class="m-top"
              v-model="to"
              size="small"
              :default-value="to"
              format="H:mm:ss:SSS"
              @change="setTime(false, this.to)"
            ></el-time-picker>
          </el-col>
          <el-col :span="4">
            <el-button class="comp-btn" @click="incrTime(false, 0.01)"
              >+
            </el-button>
            <el-button class="comp-btn" @click="incrTime(false, -0.01)"
              >-
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-col>
</template>
<style>
.float {
  float: left;
}
.comp-btn.el-button {
  width: 25px;
  height: 25px;
  padding: 0px;
  margin: 0px !important;
  font-size: 18px;
}
</style>