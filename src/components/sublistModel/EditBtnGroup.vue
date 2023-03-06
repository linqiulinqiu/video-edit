<script>
export default {
  props: ["line", "showGroup"],
  watch: {
    showGroup: function (newBool, oldBool) {
      if (!this.isClick) {
        this.operation = newBool;
      } else {
        this.operation = true;
        // this.isClick = true;
      }
      console.log("inwatch this.opration =", this.operation);
    },
  },
  data() {
    console.log("show ?", this.showGroup);
    return {
      operation: this.showGroup,
      isClick: false,
    };
  },
  methods: {
    del() {
      this.isClick = true;
      console.log("opration:", this.operation);
    },
  },
};
</script>
<template>
  <el-button-group v-show="this.operation">
    <el-button plain @click="del(this.line)"
      ><el-icon><Delete /></el-icon
    ></el-button>
    <el-button plain @click="console.log('123445')"
      ><el-icon><DocumentAdd /></el-icon
    ></el-button>
    <el-button plain
      ><el-icon><Plus /></el-icon
    ></el-button>
    <el-button plain
      ><el-icon><Minus /></el-icon
    ></el-button>
  </el-button-group>
</template>