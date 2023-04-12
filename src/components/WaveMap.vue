<script>
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";
import { usePlayerStore } from "@/stores/player";

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

export default {
  computed: {
    ...mapState(usePlayerStore, ["pos"]),
    ...mapState(useSrtStore, ["activeLine", "lines", "video"]),
    ...mapStores(useWaveSelStore, useSrtStore),
  },
  watch: {
    video(newV) {
      this.loadWaveform(newV.id);
    },
    pos(newPos, oldPos) {
      if (newPos != null && this.waveform && this.waveSelStore.pos == null) {
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
      regions: [],
    };
  },
  mounted() {
    // Initialize WaveSurfer instance
    this.waveform = WaveSurfer.create({
      // container: this.$refs.waveform,
      container: "#waveform",
      waveColor: "#358",
      progressColor: "#a75",
      plugins: [RegionsPlugin.create({})],
    });
    const widget = this;
    this.waveform.on("ready", () => {
      this.waveSelStore.duration = this.waveform.getDuration();
      console.log("waveform ready", this.waveSelStore.duration);
    });
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
        this.srtStore.setLines(lines);
        this.updateRegions();
      }
    });
  },
  methods: {
    async loadWaveform(id) {
      this.waveform.load(`/video-store/audio-stream/${id}`);
      this.updateRegions();
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
  <el-col id="waveform" ref="waveform"></el-col>
</template>
<style>
</style>