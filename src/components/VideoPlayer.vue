<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { usePlayerStore } from "@/stores/player";
import { useSrtStore } from "@/stores/srt";
import { iteratee } from "lodash";

export default {
  computed: {
    ...mapState(useSrtStore, ["activeLine", "lines"]),
    ...mapStores(useWaveSelStore, useSrtStore, usePlayerStore),
  },
  props: {
    videoAt: String,
  },
  data() {
    return {
      player: null,
      playing: false,
      posChecker: null,
    };
  },
  watch: {
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
          const playPromise = this.player.play();
          if (playPromise != undefined) {
            playPromise
              .then((_) => {
                this.playing = true;
              })
              .catch((error) => {
                console.log("play error", error);
              });
          }
          // this.player.play();
          // this.playing = true;
        }
      }
    },
  },
  mounted() {
    if (this.videoAt) {
      const options = {
        controls: true,
        // fill: true,
        autoplay: true,
        sources: [
          {
            src: this.videoAt,
            type: "video/mp4",
          },
        ],
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
  <video
    ref="videoPlayer"
    class="video-js"
    height="350"
    width="500"
    data-setup="{}"
  ></video>
</template>