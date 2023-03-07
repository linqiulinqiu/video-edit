<template>
  <el-tooltip effect="dark" :content="content" placement="top-start">
    <slot></slot>
  </el-tooltip>
</template>
<script>
export default {
  props: ["content"],
};
</script>