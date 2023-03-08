<script>
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";
import { usePlayerStore } from "@/stores/player";

import * as srtparsejs from "srtparsejs";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

export default {
  props: {
    audioAt: String,
    srtAt: String,
  },
  computed: {
    ...mapState(usePlayerStore, ["pos"]),
    ...mapState(useSrtStore, ["activeLine", "lines"]),
    ...mapStores(useWaveSelStore, useSrtStore, usePlayerStore),
  },
  watch: {
    pos(newPos, oldPos) {
      if (newPos!=null && this.waveform && this.waveSelStore.pos==null) {
        this.waveform.setCurrentTime(newPos);
        this.updateActiveLine();
      }
    },
    lines(newLines, oldLines) {
      this.updateRegions();
    },
    activeLine(newAl, oldAl) {
      if (oldAl >= 0 && oldAl < this.regions.length) {
        this.regions[oldAl].update({
          drag: false,
          resize: false,
          color: "rgba(0,0,0,0.1)",
        });
      }
      if (newAl >= 0 && newAl < this.regions.length) {
        this.regions[newAl].update({
          drag: true,
          resize: true,
          color: "rgba(0,0,0,0.3)",
        });
      }
    },
  },
  data() {
    return {
      regions: []
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
    this.loadWaveform();
  },
  methods: {
    async loadWaveform() {
      // Load audio file
      this.waveform.load(this.audioAt);
      this.waveform.on("ready", () => {
        this.waveSelStore.duration = this.waveform.getDuration();
      });
      if (this.srtAt) {
        const resp = await fetch(this.srtAt);
        const body = await resp.text();
        const srt = srtparsejs.parse(body);
        const lines = [];
        for (var i in srt) {
          const line = srt[i];
          lines.push({
            speaker: 1,
            from: srtparsejs.toMS(line.startTime) / 1000,
            to: srtparsejs.toMS(line.endTime) / 1000,
            textZh: line.text,
            textEn: line.text,
          });
          this.srtStore.lines = lines;
        }
      }
      this.updateRegions();
      const widget = this;
      this.waveform.on("region-click", (e) => {
          widget.waveSelStore.pos = e.start 
          widget.updateActiveLine();
      });
    },
    updateRegions() {
      while (this.regions.length > 0) {
        const region = this.regions.pop();
        region.remove();
      }
      for (var i in this.lines) {
        const line = this.lines[i];
        const prop = {
            id: `line-${i}`,
            start: line.from,
            end: line.to,
            loop: false,
            drag: false,
            resize: false,
        }
        if(i == this.activeLine){
          prop.color= "rgba(0,0,0,0.3)"
        }
        this.regions.push(
          this.waveform.addRegion(prop)
        );
      }
    },
    updateActiveLine() {
      const lines = this.srtStore.lines;
      let pos = this.waveSelStore.pos;
      if(!pos) pos = this.pos;
      if (this.activeLine >= 0 && this.activeLine < lines.length) {
        if (
          lines[this.activeLine].from <= pos &&
          lines[this.activeLine].to > pos
        ) {
          return;
        }
      }
      var al = -1;
      for (var i in lines) {
        const line = lines[i];
        if (pos >= line.from && pos < line.to) {
          al = i;
          break;
        }
      }
      this.srtStore.activeLine = al;
    },
  },
};
</script>

<template>
  <div>
    <div ref="waveform"></div>
  </div>
</template>