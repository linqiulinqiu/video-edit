<template>
  <el-col>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-select v-model="sid" placeholder="Speaker ID">
          <el-option
            v-for="(spk, index) in speakerList"
            :key="spk.name"
            :value="spk.id"
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
        <el-button :disabled="!sid || !voiceTxt" @click="makeVoice">生成语音</el-button>
      </el-col>
      <el-col :span="4">
        <audio controls :src="url"></audio>
      </el-col>
      <el-col :span="2">
        <el-button :disabled="url==''" @click="downV">下载音频</el-button>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useSpStore } from "@/stores/splist";

export default {
  computed: {
    ...mapState(useSpStore, ["speakerList"]),
    ...mapState(useSrtStore, ["lang_id"])
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
    async makeVoice(){
      // TODO: enable Download Button after voice made/ready
      const form = new FormData()
      form.append('lang', this.lang_id)
      form.append('spk', this.sid)
      form.append('text', this.voiceTxt)
      form.append('csrf', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
      
      const resp = await fetch('/made-cache/make-voice', {
          body: form,
          method: 'POST'
      });
      const resj = await resp.json()
      console.log('resp-json', resj)
      if('url' in resj){
        this.url = resj.url
      }
    }
  },
};
</script>