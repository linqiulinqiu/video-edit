<script>
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

export default {
  computed: {
    ...mapState(useWaveSelStore, ["pos"]),
    ...mapState(useSrtStore, ["activeLine"]),
    ...mapStores(useWaveSelStore, useSrtStore),
  },
  watch: {
    pos(newPos, oldPos) {
      if (!this.playing) {
        console.log("pos changed", oldPos, newPos);
        this.updateActiveLine();
      }
    },
    activeLine(newAl, oldAl) {
      if (this.region) {
        this.region.remove();
        this.region = false;
      }
      if (newAl >= 0) {
        const line = this.srtStore.lines[newAl];
        this.region = this.waveform.addRegion({
          id: "activeLine",
          start: line.from,
          end: line.to,
          loop: false,
          drag: false,
          resize: false,
        });
      }
    },
  },
  data() {
    return {
      playing: false,
      region: false,
    };
  },
  mounted() {
    // Initialize WaveSurfer instance
    this.waveform = WaveSurfer.create({
      container: this.$refs.waveform,
      waveColor: "#358",
      progressColor: "#a75",
      plugins: [RegionsPlugin.create({})],
    });

    // Load audio file
    this.waveform.load("/audio.mp3");
    this.waveform.on("ready", () => {
      this.waveSelStore.duration = this.waveform.getDuration();
    });
    this.waveform.on("seek", this.updatePos);
    this.waveform.on("audioprocess", this.updatePos);
    this.waveform.on("play", () => {
      this.playing = true;
    });
    this.waveform.on("finish", () => {
      this.playing = false;
    });
    this.waveform.on("region-play", () => {
      this.playing = true;
    });
    this.waveform.on("pause", () => {
      this.playing = false;
    });
  },
  methods: {
    updatePos() {
      this.waveSelStore.setPos(this.waveform.getCurrentTime());
    },
    updateActiveLine() {
      const lines = this.srtStore.lines;
      const pos = this.waveSelStore.pos;
      var al = -1;
      for (var i in lines) {
        const line = lines[i];
        if (pos >= line.from && pos < line.to) {
          al = i;
          break;
        }
      }
      this.srtStore.activeLine = al;
      console.log("activeLine in update:", this.srtStore.activeLine);
    },
    togglePlay() {
      if (this.playing) {
        this.waveform.pause();
      } else {
        if (this.region) {
          this.region.play();
        } else {
          this.waveform.play();
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <div ref="waveform"></div>
    <div>
      <button v-on:click="togglePlay">
        <span v-if="playing">Stop</span><span v-else>Play</span>
      </button>
    </div>
  </div>
</template>