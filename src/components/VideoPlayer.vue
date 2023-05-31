<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { usePlayerStore } from "@/stores/player";
import { useSrtStore } from "@/stores/srt";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine", "lines", "video"]),
    ...mapStores(useWaveSelStore, usePlayerStore),
  },
  data() {
    return {
      player: null,
      playing: false,
      posChecker: null,
    };
  },
  watch: {
    video(newV) {
      const newId = newV.id;
      if (newId > 0) {
        const videoAt = `/video-store/video-stream/${newId}`;
        const sources = [
          {
            src: videoAt,
            type: "video/mp4",
          },
        ];
        this.player.src(sources);
      }
    },
    activeLine(newAl, oldAl) {
      if (this.player) {
        if (this.playing) {
          this.player.pause();
          this.playing = false;
          this.playerStore.pos = null;
        }
        if (newAl < this.lines.length && newAl >= 0) {
          const start = this.lines[newAl].from;
          this.player.currentTime(start);
          this.playerStore.pos = start;
          this.waveSelStore.pos = null;
          const playPromise = this.player.pause();
          if (playPromise != undefined) {
            playPromise
              .then((_) => {
                this.playing = true;
              })
              .catch((error) => {
                console.log("play error", error);
              });
          }
          // const line = this.lines[newAl];
          // console.log("this.player", this.player);
          // // this.player.play(line.from, line.to);
          // this.playing = true;
        }
      }
    },
  },
  mounted() {
    const options = {
      controls: true,
      fill: true,
      aspectRatio: "4:3",
      autoplay: false,
    };
    this.player = videojs(this.$refs.videoPlayer, options, () => {});
    if (!this.posChecker) {
      const widget = this;
      this.posChecker = setInterval(() => {
        if (widget.playing && widget.player) {
          const ctime = widget.player.currentTime();
          widget.playerStore.pos = ctime;
        }
      }, 50);
    }
  },
  beforeUnmount() {
    if (this.player) {
      if (this.posChecker) {
        clearInterval(this.posChecker);
        this.posChecker = null;
      }
      this.player.dispose();
      this.player = null;
    }
  },
};
</script>

<template>
  <el-col class="video-play">
    <video
      ref="videoPlayer"
      class="video-js"
      height="350"
      width="500"
      data-setup="{}"
    ></video>
  </el-col>
</template>
<style>
.video-play {
  margin-top: 25px;
  padding: 15px;
  background-color: #000;
  border-radius: 20px;
  text-align: center;
}
</style>