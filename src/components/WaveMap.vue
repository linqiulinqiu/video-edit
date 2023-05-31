<script>
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";
import { usePlayerStore } from "@/stores/player";

import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";
import cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor.js";

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
      console.log("newPos", newPos);
      if (newPos != null && this.waveform && this.waveSelStore.pos == null) {
        this.waveform.setCurrentTime(newPos);
        this.updateActiveLine();
      }
    },
    lines(newLines, oldLines) {
      this.updateRegions();
    },
    activeLine(newAl, oldAl) {
      console.log("activeLine New: ", newAl);
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
      const line = this.lines[newAl];
      this.playAudio(line.from, line.to);
      // const progress = newAl / this.lines.length;
      // this.waveform.seekProgress(progress);
    },
  },
  data() {
    return {
      regions: [],
      pxArr: [5, 25, 50, 100, 200, 400],
      minPxPerSec: 50,
      errTxt: "",
    };
  },
  mounted() {
    // Initialize WaveSurfer instance
    this.waveform = WaveSurfer.create({
      // container: this.$refs.waveform,
      container: "#waveform",
      waveColor: "#358",
      progressColor: "#a75",
      backend: "MediaElement",
      minPxPerSec: this.minPxPerSec,
      scrollParent: true,
      autoCenter: true,
      plugins: [
        RegionsPlugin.create({}),

        cursor.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            "background-color": "#000",
            color: "#fff",
            padding: "2px",
            "font-size": "10px",
          },
        }),
      ],
    });
    const widget = this;
    this.waveform.on("error", (e) => {
      console.log("waveform error", e);
      this.errTxt = e + "，请刷新页面后再查看。";
    });
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
      const res = await this.waveform.load(`/video-store/audio-stream/${id}`);
      // const blob = await fetch(`/video-store/audio-stream/${id}`);
      // console.log("blob:", blob);
      // const res = await this.waveform.load(blob.url);
      console.log("loadwaveform res", res, `load waveform id=${id}`);
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
    playAudio(start, end) {
      this.waveform.play(start, end);
    },
    audioZoom(pxPerSec) {
      this.minPxPerSec = pxPerSec;
      this.waveform.zoom(pxPerSec);
      console.log(
        "pxPerSec:",
        pxPerSec,
        "this.waveform:",
        this.waveform,
        this.waveform.params.minPxPerSec
      );
    },
  },
};
</script>

<template>
  <el-scrollbar>
    <el-col>
      <span>音频缩放倍数：</span>
      <el-select
        class="sel-width"
        v-model="minPxPerSec"
        :placeholder="minPxPerSec / 50 + 'x'"
        @change="audioZoom(minPxPerSec)"
      >
        <el-option
          v-for="item in pxArr"
          :key="item"
          :label="item / 50 + 'x'"
          :value="item"
        ></el-option>
      </el-select>
      <el-text type="danger">{{ errTxt }}</el-text>
    </el-col>
    <el-col id="waveform" ref="waveform"></el-col>
    <!-- <el-col id="timeline" ref="timeline"></el-col> -->
  </el-scrollbar>
</template>
<style scoped>
.el-select.sel-width {
  width: 100px;
  margin-bottom: 5px;
}
</style>