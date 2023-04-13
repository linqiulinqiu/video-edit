<template>
  <el-col>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-select v-model="sid" placeholder="Speaker ID">
          <el-option
            v-for="(spk, index) in speakerList"
            :key="spk.name"
            :value="index"
            :label="spk.id + ' -- ' + spk.name + ' -- ' + spk.gender"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="9"
        ><el-input
          type="text"
          v-model="voiceTxt"
          placeholder="自定义内容"
          clearable
          maxlength="40"
          minlength="2"
          :show-word-limit="true"
      /></el-col>
      <el-col :span="2">
        <el-button>生成语音</el-button>
      </el-col>
      <el-col :span="4">
        <audio controls :src="this.url"></audio>
      </el-col>
      <el-col :span="2">
        <el-button @click="downV">下载音频</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import { mapState, mapStores } from "pinia";
import { useSpStore } from "@/stores/splist";

export default {
  computed: {
    ...mapState(useSpStore, ["speakerList"]),
  },
  data() {
    return {
      sid: "",
      url: "",
      voiceTxt: "",
    };
  },
  methods: {
    downV() {
      //下载音频
      this.url = this.speakerList[this.sid].demo;
      window.location.href = this.url;
    },
  },
};
</script>