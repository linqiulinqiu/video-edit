<script>
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";
import { usePlayerStore } from "@/stores/player";

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

export default {
  props: {
    audioAt: String,
  },
  computed: {
    ...mapState(usePlayerStore, ["pos"]),
    ...mapState(useSrtStore, ["activeLine", "lines"]),
    ...mapStores(useWaveSelStore, useSrtStore, usePlayerStore),
  },
  watch: {
    pos(newPos, oldPos) {
      if (newPos != null && this.waveform && this.waveSelStore.pos == null) {
        this.waveform.setCurrentTime(newPos);
        this.updateActiveLine();
      }
    },
    lines(newLines, oldLines) {
      // console.log('lines', newLines)
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
    this.loadWaveform();
  },
  methods: {
    async loadWaveform() {
      // Load audio file
      this.waveform.load(this.audioAt);
      this.waveform.on("ready", () => {
        this.waveSelStore.duration = this.waveform.getDuration();
      });
      this.updateRegions();
      const widget = this;
      this.waveform.on("region-click", (e) => {
        widget.waveSelStore.pos = e.start;
        widget.updateActiveLine();
      });
      // TODO: check overlap: cancel update when overlap
      this.waveform.on("region-update-end", (e) => {
        if (
          Object.keys(this.waveform.regions.list).length ==
          this.srtStore.lines.length
        ) {
          let i = 0;
          const lines = [];
          for (let idx in this.waveform.regions.list) {
            const region = this.waveform.regions.list[idx];
            const line = Object.assign({}, this.srtStore.lines[i]);
            line.from = region.start;
            line.to = region.end;
            lines.push(line);
            i++;
          }
          this.srtStore.lines = lines;
          this.srtStore.setLines(lines, this.waveSelStore.duration);
          console.log("lines = ", this.srtStore.lines);
          this.updateRegions();
        }
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
          drag: true,
          resize: true,
        };
        if (i == this.activeLine) {
          prop.color = "rgba(0,0,0,0.3)";
        }
        this.regions.push(this.waveform.addRegion(prop));
      }
    },
    updateActiveLine() {
      const lines = this.srtStore.lines;
      let pos = this.waveSelStore.pos;
      if (!pos) pos = this.pos;
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