<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";

export default {
  computed: {
    ...mapStores(useSrtStore),
    ...mapState(useSrtStore, ["sid", "lines", "audio", "spks", "tdirty"]),
    percent() {
      return Math.floor(this.percent_stage);
    },
    canDown() {
      let nm = 0;
      if (this.audio.length > 0) {
        for (let i in this.audio) {
          if (this.audio[i].len > 0) {
            nm++;
          }
        }
      }
      if (nm > 0) return true;
      return false;
    },
    link() {
      return "https://gwl.brimod.com/made-cache/audio-out/" + this.sid;
    },
  },

  methods: {
    async makeAudio() {
      const loading = this.$loading({
        fullscreen: true,
        background: "#9dbfc122",
        text: "音频生成中",
        lock: true,
      });
      this.making = true;
      var needMake = [];
      for (let idx in this.audio) {
        if (this.audio[idx].len == 0) {
          needMake.push(idx);
        }
      }
      const obj = this;
      let progress = 0;
      if (needMake.length == 0) {
        this.percent_stage = 1 * 100;
      } else {
        for (let i in needMake) {
          const idx = needMake[i];
          const line = this.lines[idx];
          const form = new FormData();
          form.append("spk", this.spks[line.speaker].speaker_id);
          form.append("text", line.text);
          form.append("sid", this.sid);
          form.append(
            "csrf",
            document
              .querySelector('meta[name="csrf-token"]')
              .getAttribute("content")
          );
          const resp = await fetch("/made-cache/make-voice", {
            body: form,
            method: "POST",
          }).then(() => {
            progress += 1;
            obj.percent_stage = (progress / needMake.length) * 100;
          });
        }
        await this.srtStore.saveSrt();
      }
      this.making = false;
      loading.close();
    },
    downAudio() {
      window.open(this.link);
    },
  },
  data() {
    return {
      making: false,
      percent_stage: 0,
    };
  },
};
</script>
<template>
  <el-button v-if="tdirty" @click="makeAudio()"> Make Audio</el-button>
  <el-button v-else-if="canDown" @click="window.open(link)">
    Down Audio
  </el-button>

  <!-- <el-col v-if="tdirty">
    <el-button :disabled="tdirty == false" @click="makeAudio()">
      Make Audio
    </el-button>
    <el-button :disabled="!canDown">
      <el-link :href="link" :disabled="!canDown"
        ><el-icon><Download /></el-icon></el-link
    ></el-button>
  </el-col> -->
  <!-- <el-col v-else :span="14" :offset="5">
    <el-progress
      color="#1d5d68"
      :text-inside="true"
      :stroke-width="26"
      :percentage="percent"
    />
  </el-col> -->
</template>