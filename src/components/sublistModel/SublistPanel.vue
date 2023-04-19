<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import Sublist from "@/components/sublistModel/Sublist.vue";

export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useSrtStore, ["sid", "lines", "audioLens"]),
    percent() {
      return this.percent_stage;
    },
  },
  components: {
    Sublist,
  },
  methods: {
    async loadSrt() {
      await this.srtStore.loadSrt();
    },
    async saveSrt() {
      await this.srtStore.saveSrt();
    },
    async makeAudio() {
      const loading = this.$loading({
        fullscreen: true,
        background: "#9dbfc1ad",
        text: "音频生成中",
        lock: true,
      });
      this.isMake = true;
      var needMake = [];
      for (let idx in this.audioLens) {
        console.log("len,", idx);
        if (this.audioLens[idx] == 0) {
          needMake.push(idx);
        }
      }
      console.log(needMake);
      const obj = this;
      let progress = 0;
      if (needMake.length == 0) {
        this.percent_stage = 1 * 100;
      } else {
        for (let i in needMake) {
          const idx = needMake[i];
          const line = this.lines[idx];
          const form = new FormData();
          form.append("spk", line.speaker);
          form.append("text", line.text);
          form.append("sid", this.sid);
          form.append(
            "csrf",
            document
              .querySelector('meta[name="csrf-token"]')
              .getAttribute("content")
          );
          await fetch("/made-cache/make-voice", {
            body: form,
            method: "POST",
          }).then(() => {
            // obj.percent_stage += 1;
            progress += 1;
            obj.percent_stage = (progress / needMake.length) * 100;
            console.log("percent:", obj.percent_stage);
          });
        }
      }
      this.isMake = false;
      loading.close();
    },
  },
  data() {
    return {
      isMake: false,
      percent_stage: 0,
    };
  },
};
</script>
<template>
  <el-col v-if="!isMake">
    <el-button @click="loadSrt()">Load</el-button>
    <el-button @click="saveSrt()">Save</el-button>
    <el-button @click="makeAudio()"> Make Audio </el-button>
  </el-col>
  <el-col v-else>
    <el-progress
      :indeterminate="true"
      :text-inside="true"
      :stroke-width="26"
      :percentage="percent"
    />
  </el-col>
</template>