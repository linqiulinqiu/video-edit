
<script>
export default {
  props: ["value"],
  computed: {
    textFrom() {
      return this.formTime(this.from);
    },
    textTo() {
      return this.formTime(this.to);
    },
  },
  data() {
    // const from_t = this.value.from * 1000;
    return {
      from: this.formTime(this.value.from * 1000),
      to: this.formTime(this.value.to * 1000),
    };
  },
  methods: {
    formTime(time) {
      //time is millisecondes
      const d = new Date(this.value.from * 1000);
      // console.log("d ", d);
      const offset = d.getTimezoneOffset() * 60 * 1000;
      const time_obj = new Date(time + offset);
      return time_obj;
    },
    parseTime(time) {
      time = this.formTime(time);
      console.log("time in formTime", time);

      // const ftime =
      //   "" +
      //   time.getHours() +
      //   ":" +
      //   time.getMinutes() +
      //   ":" +
      //   (time.getSeconds() + time.getMilliseconds() / 1000).toFixed(2);
      return time;
    },
    modifyTime(count, isFrom, time) {
      let ms = time.getMilliseconds();

      console.log(ms, typeof ms, time, this.from);
      if (count == "+") {
        ms = ms + 10;
      } else if (count == "-") {
        ms = ms - 10;
      }
      console.log("time type = ", time, typeof time, time.setMilliseconds());

      if (isFrom) {
        time.setMilliseconds(ms);
        // console.log("ms = ", ms, t_ms);
        this.from = this.formTime(time);
        console.log("from ===", this.from);
      } else {
        this.to = this.formTime(this.to.setMilliseconds(ms));
      }
    },
    // incr(idx) {
    //   let ms = this.values[idx].getMilliseconds() + 10;
    //   this.values[idx].setMilliseconds(ms);
    //   //TODO: control range/min/max
    //   console.log("values=", this.values);
    //   this.values = this.values.concat();
    // },
    // decr(idx) {
    //   let ms = this.values[idx].getMilliseconds() - 10;
    //   this.values[idx].setMilliseconds(ms);
    //   this.values = this.values.concat();
    // },
    changeFrom(val) {
      console.log("change From = ", val);
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
            <el-button
              class="comp-btn"
              @click="modifyTime('+', true, this.from)"
              >+
            </el-button>
            <el-button
              class="comp-btn"
              @click="modifyTime('-', true, this.from)"
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
              @change="changeFrom(this.from)"
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
            ></el-time-picker>
          </el-col>
          <el-col :span="4">
            <el-button class="comp-btn" @click="modifyTime('+', false, this.to)"
              >+
            </el-button>
            <el-button class="comp-btn" @click="modifyTime('-', false, this.to)"
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