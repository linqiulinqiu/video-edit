import { defineStore } from "pinia";
import { useSpStore } from "./splist";

export const useSrtStore = defineStore("srt", {
  state: () => ({
    stored: {
      spks: [],
      lines: [],
      audio: {},
    },
    history: [],
    spks: [],
    lines: [],
    lang_id: 0,
    reflines: [],
    refaudio: [],
    sid: 0,
    audio: [],
    video: {},
    activeLine: -1,
    loadDone: false,
  }),
  getters: {
    tdirty() {
      // text related dirty, when it's true, voice make should be enabled
      if (
        this.spks.length != this.stored.spks.length ||
        this.lines.length != this.stored.lines.length
      ) {
        return true;
      }
      //TODO: check spks and stored.spks are actually the same
      for (let i in this.spks) {
        if (this.spks[i].speaker_id != this.stored.spks[i].speaker_id)
          return true;
      }
      for (let i in this.lines) {
        if (this.lines[i].text != this.stored.lines[i].text) return true;
      }
      for (let i in this.audio) {
        if (this.audio[i].len == 0) return true;
      }
      return false;
    },
    dirty() {
      // any dirty, when true, undo/save should be enabled
      if (this.tdirty) return true;
      for (let i in this.lines) {
        if (this.lines[i].start_ms != this.stored.lines[i].start_ms)
          return true;
        if (this.lines[i].duration_ms != this.stored.lines[i].duration_ms)
          return true;
      }
      return false;
    },
  },
  actions: {
    setSid(sid) {
      this.sid = sid;
    },
    async loadSrt() {
      const resp = await fetch(`/subedit/subtitle-info/${this.sid}`);
      const body = await resp.json();
      if (body.error) {
        return { error: body.error };
      }
      console.log("load data:", body);
      const chunks = body.subsnap.chunks;
      const lines = [];
      this.lang_id = body.lang_id;
      var texxxt = [];
      for (var i in chunks) {
        const line = chunks[i];
        texxxt.push(chunks[i].body);
        const item = {
          speaker: line.spk,
          from: line.start_ms / 1000,
          to: (line.start_ms + line.duration_ms) / 1000,
        };
        item.text = line.body;
        lines.push(item);
      }
      console.log("chunks:", texxxt);
      if ("refchunks" in body && "en-US" in body.refchunks) {
        this.reflines = body.refchunks["en-US"];
      } else {
        this.reflines = [];
      }
      this.audio = body.subsnap.audio;
      this.video = Object.assign(
        {},
        {
          time: body.video.duration_ms / 1000,
          id: body.video.id,
          pathName: body.video.pathname,
        }
      );
      this.setSpks(body.subsnap.spks);
      this.setStored(body.subsnap.spks, lines, body.subsnap.audio);
      this.setLines(lines);
      this.history = [];
    },
    setStored(spks, lines, orig_audio) {
      const audio = {};
      for (let i in lines) {
        const line = lines[i];
        if (orig_audio[i].len > 0) {
          audio[`${spks[line.speaker]["speaker_id"]}--${line.text}`] =
            orig_audio[i];
        }
      }
      this.stored = {
        // TODO: optimize for speed
        spks: JSON.parse(JSON.stringify(spks)),
        lines: JSON.parse(JSON.stringify(lines)),
        audio: audio,
      };
    },
    async saveSrt() {
      const chunks = [];
      for (let i in this.lines) {
        const line = this.lines[i];
        line.text = line.text.trim();
        const start_ms = parseInt(line.from * 1000);
        const item = {
          spk: line.speaker,
          start_ms: start_ms,
          duration_ms: parseInt(line.to * 1000) - start_ms,
          body: line.text,
        };
        chunks.push(item);
      }
      const spks = [];
      for (let i in this.spks) {
        const spk = this.spks[i];
        spks.push({
          speaker_id: spk.speaker_id,
          gender: spk.gender,
          age: spk.age,
        });
      }
      const form = new FormData();
      form.append("chunks", JSON.stringify(chunks));
      form.append("spks", JSON.stringify(spks));
      await fetch(`/subedit/save-snap/${this.sid}`, {
        body: form,
        method: "POST",
      });
      this.setStored(this.spks, this.lines, this.audio); //TODO: confirm audio updated from make-audio
      this.history = [];
    },
    setLine(idx, line) {
      const ls = [];
      for (let i = 0; i < this.lines.length; i++) {
        ls.push({
          from: this.lines[i].from,
          to: this.lines[i].to,
          speaker: this.lines[i].speaker,
          text: this.lines[i].text,
        });
      }
      line = {
        from: line.from,
        to: line.to,
        speaker: line.speaker,
        text: line.text,
      };
      if (idx >= ls.length) {
        ls.push(line);
      } else {
        ls[idx] = line;
      }
      this.setLines(ls);
    },
    setLines(lines) {
      if (lines.length > 0) {
        // a smarter way: check audio/lines/spks changed, only push changed data into history
        this.history.push({
          audio: this.audio,
          lines: this.lines,
          spks: this.spks,
        }); // when undo: pop history to this, when load/save cleanup history

        const audio = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const key = `${this.spks[line.speaker]["speaker_id"]}--${line.text}`;
          if (key in this.stored.audio) {
            audio.push({
              len: this.stored.audio[key].len,
              hash: this.stored.audio[key].hash,
            });
          } else {
            audio.push({
              len: 0,
              hash: "",
            });
          }
        }
        this.audio = audio;
        let overlap = false;
        let lastTo = 0;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          line.text = line.text.trim();
          if (line.from < lastTo) {
            overlap = true;
          }
          lastTo = line.to;
        }
        if (lines.length == 1) {
          lines[0].min = lines[0].from;
          lines[0].max = lines[0].to;
        } else {
          for (let i = 0; i < lines.length; i++) {
            let min = "";
            let max = "";
            if (i == 0) {
              min = 0;
              max = lines[i + 1].from;
            } else if (i == lines.length - 1) {
              min = lines[i - 1].to;
              max = lines[i].to;
            } else {
              min = lines[i - 1].to;
              max = lines[i + 1].from;
            }
            lines[i].min = min;
            lines[i].max = max;
          }
        }
        if (lastTo >= this.video.time) {
          lines[lines.length - 1].to = this.video.time;
          console.log(
            "Overlap! Seems OpenAI generate srt longer than audio itself, need handle& fix"
          );
          overlap = true;
        }
        this.lines = [...lines];

        return overlap;
      } else {
        this.lines = [];
        return false;
      }
    },
    setSpks(spks) {
      const sp = useSpStore().speakerList;
      for (let i in spks) {
        const spk = spks[i];
        for (let k in sp) {
          if (sp[k].id == spk.speaker_id) {
            spk["name"] = sp[k].name;
            spk["demo"] = sp[k].demo;
          }
        }
      }
      this.spks = spks;
    },
    setReflines(lines) {
      this.reflines = lines;
    },
    undo() {},
  },
});
