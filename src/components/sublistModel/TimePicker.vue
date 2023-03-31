
<script>
export default {
  props: ["value"],
  computed: {
    textFrom() {
      return this.formTime(this.values[0]);
    },
    textTo() {
      // const v = this.values[1];
      return this.formTime(this.values[1]);
    },
  },
  data() {
    const d = new Date(this.value.from * 1000);
    const offset = d.getTimezoneOffset() * 60 * 1000;
    const values = [
      new Date(this.value.from * 1000 + offset),
      new Date(this.value.to * 1000 + offset),
    ];

    console.log(
      "values=",
      values,
      "offset=",
      offset,
      values[0].getTimezoneOffset()
    );
    return { values: values, from: values[0], to: values[1] };
  },
  methods: {
    formTime(time) {
      return (
        "" +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        (time.getSeconds() + time.getMilliseconds() / 1000).toFixed(2)
      );
    },
    incr(idx) {
      let ms = this.values[idx].getMilliseconds() + 10;
      this.values[idx].setMilliseconds(ms);
      //TODO: control range/min/max
      console.log("values=", this.values);
      this.values = this.values.concat();
    },
    decr(idx) {
      let ms = this.values[idx].getMilliseconds() - 10;
      this.values[idx].setMilliseconds(ms);
      this.values = this.values.concat();
    },
  },
};
</script>
<template>
  <el-col>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-button size="small" @click="incr(0)">+</el-button>
        <el-time-picker
          :model-value="from"
          size="small"
          :default-value="from"
          format="H:mm:ss:SSS"
        ></el-time-picker>
        <el-button size="small" @click="decr(0)">-</el-button>
      </el-col>
      <el-col :span="2">--</el-col>
      <el-col :span="8"
        ><el-button size="small" @click="incr(1)">+</el-button>
        <el-time-picker
          :model-value="to"
          size="small"
          :default-value="to"
          format="H:mm:ss:SSS"
        ></el-time-picker>

        <el-button size="small" @click="decr(1)">-</el-button></el-col
      >

      <!-- <el-time-picker
        :value="values"
        :default-value="values"
        :start-placeholder="textFrom"
        :end-placeholder="textTo"
        is-range
        format="H:mm:ss:SSS"
        size="small"
      /> -->
    </el-row>
  </el-col>
</template>
<style>
.float {
  float: left;
}
</style>