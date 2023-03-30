
<script>
export default {
  props: ["line"],
  data() {
    return {
      disabledHoures: "",
      disabledMintes: "",
      disabledSeconds: "",
    };
  },
};
</script>
<template>
  <el-col>
    <p>({{ line.min }}){{ line.from }}=> {{ line.to }}({{ line.max }})</p>
    <el-time-picker
      :value="line.from"
      value-format="HH:mm:ss:SSS"
      format="HH:mm:ss:SSS"
      size="small"
    />
  </el-col>
</template>