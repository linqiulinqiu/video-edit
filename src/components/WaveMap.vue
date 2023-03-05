<script>
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";

import * as srtparsejs from "srtparsejs";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

export default {
  props: {
    audioAt: String,
    srtAt: String
  },
  computed: {
    ...mapState(useWaveSelStore, ["pos"]),
    ...mapState(useSrtStore, ["activeLine", "lines"]),
    ...mapStores(useWaveSelStore, useSrtStore),
  },
  watch: {
    pos(newPos, oldPos) {
      if (!this.playing) {
        this.updateActiveLine();
      }
    },
    lines(newLines, oldLines) {
      this.updateRegions()
    },
    activeLine(newAl, oldAl) {
      if (oldAl >= 0 && oldAl < this.regions.length) {
        this.regions[oldAl].update({
          drag: false,
          resize: false,
          color: "rgba(0,0,0,0.1)"
        })
      }
      if (newAl >= 0 && newAl < this.regions.length) {
        this.regions[newAl].update({
          drag: true,
          resize: true,
          color: "rgba(0,0,0,0.3)"
        })
      }
    },
  },
  data() {
    return {
      playing: false,
      regions: [],
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
    this.loadWaveform()
  },
  methods: {
    async loadWaveform() {
      // Load audio file
      this.waveform.load(this.audioAt)
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
      if(this.srtAt){
        const resp = await fetch(this.srtAt)
        const body = await resp.text()
        console.log('srtbody', body)
        const srt = srtparsejs.parse(body)
        const lines = []
        for(var i in srt){
          const line = srt[i]
          lines.push({
            'speaker': 1,
            'from': srtparsejs.toMS(line.startTime)/1000,
            'to':srtparsejs.toMS(line.endTime)/1000,
            'textZh': line.text,
            'textEn': line.text
          })
          this.srtStore.lines = lines
        }
      }
      this.updateRegions()
    },
    updateRegions() {
      while (this.regions.length > 0) {
        const region = this.regions.pop()
        region.remove()
      }
      for (var i in this.lines) {
        const line = this.lines[i]
        this.regions.push(this.waveform.addRegion({
          id: `line-${i}`,
          start: line.from,
          end: line.to,
          loop: false,
          drag: false,
          resize: false,
        }))
      }
    },
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
        if (this.activeLine>=0 && this.activeLine<this.regions.length) {
          this.regions[this.activeLine].play();
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