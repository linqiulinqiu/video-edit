<template>
  <el-col>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-select v-model="spkId" placeholder="Speaker ID">
          <el-option
            v-for="spk in speakerList"
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
        <MakevoiceBtn
          :sid="sid"
          :text="voiceTxt"
          :spkId="spkId"
          :url="updateUrl"
        />
      </el-col>
      <el-col :span="4">
        <audio controls :src="url"></audio>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useSpStore } from "@/stores/splist";
import MakevoiceBtn from "../lib/MakevoiceBtn.vue";

export default {
  components: {
    MakevoiceBtn,
  },
  computed: {
    ...mapState(useSpStore, ["speakerList"]),
    ...mapState(useSrtStore, ["sid"]),
  },
  data() {
    return {
      spkId: "",
      url: "",
      voiceTxt: "",
      mvRes: "",
    };
  },
  methods: {
    updateUrl(e) {
      console.log("loadUrl", e);
      if ("url" in e) {
        this.url = e.url;
      }
    },
    // async makeVoice() {
    //   // TODO: enable Download Button after voice made/ready
    //   const loading = this.$loading({
    //     fullscreen: true,
    //     background: "#9dbfc1ad",
    //     text: "音频生成中",
    //     lock: true,
    //   });
    //   const form = new FormData();
    //   form.append("spk", this.spkId);
    //   form.append("text", this.voiceTxt);
    //   form.append("sid", this.sid);
    //   form.append(
    //     "csrf",
    //     document
    //       .querySelector('meta[name="csrf-token"]')
    //       .getAttribute("content")
    //   );

    //   const resp = await fetch("/made-cache/make-voice", {
    //     body: form,
    //     method: "POST",
    //   });
    //   const resj = await resp.json();
    //   console.log("resp-json", resj);
    //   if ("url" in resj) {
    //     this.url = resj.url;
    //   }
    //   loading.close();
    // },
  },
};
</script>