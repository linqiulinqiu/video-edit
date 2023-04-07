
<script>
export default {
  props: ["value"],
  emits: ["update:modelValue"],
  computed: {
    textFrom() {
      return this.formTime(this.from);
    },
    textTo() {
      return this.formTime(this.to);
    },
  },
  data() {
    // console.log("value = ", this.value);
    return {
      from: this.formTime(this.value.from * 1000),
      to: this.formTime(this.value.to * 1000),
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
    console.log("value in mounted", this.value);
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
    makeRange(start, end) {
      if (start < end) {
        let rangeArr = [];
        for (let i = start; i <= end; i++) {
          rangeArr.push(i);
        }
        return rangeArr;
      } else {
        console.log("start=", start, "end=", end);
        return [0];
      }
    },
    time_range(min, max, timeLimit) {
      const idxArr = Object.keys(timeLimit);
      for (let item in timeLimit) {
        if (timeLimit.hasOwnProperty(item)) {
          const idx = idxArr.indexOf(item);
          if (idx != -1) {
            timeLimit[item] = this.makeRange(min[idx], max[idx]);
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
      console.log("fromLimit--toLimit:", this.fromlimit, this.tolimit);
    },
    disableHH(limit_h) {
      return limit_h;
    },
    disableMM(limit_m) {
      return limit_m;
    },
    disableSS(limit_s) {
      return limit_s;
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
              class="pick-time"
              v-model="from"
              size="small"
              :default-value="from"
              format="H:mm:ss:SSS"
              @change="setTime(true, this.from)"
          /></el-col>
        </el-row>
      </el-col>
      <el-col :span="2"> -> </el-col>
      <el-col :span="11">
        <el-row>
          <el-col :span="19">
            <el-time-picker
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
  width: 22px;
  height: 20px;
  padding: 0px;
  margin: 0px !important;
}
.el-date-editor {
  --el-date-editor-width: 105px;
}
.pick-time.el-input__wrapper {
  width: 200px !important;
}
</style>