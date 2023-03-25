import { defineStore } from 'pinia'
import * as srtparsejs from "srtparsejs";

export const useSrtStore = defineStore('srt', {
    state: () => ({
        spks: [],
        lines: [],
        videoId: 0,
        activeLine: -1
    }),
    actions: {
        async loadSrt(duration) {
            const id = 2
            const resp = await fetch(`/subedit/subtitle-info/${id}`);
            const body = await resp.json();
            const chunks = body.subsnap.chunks
            const lines = [];
            for (var i in chunks) {
                const line = chunks[i];
                const item = {
                    speaker: line.spk,
                    from: line.start_ms / 1000,
                    to: (line.start_ms + line.duration_ms)/1000,
                };
                item.text = line.body
                lines.push(item)
            }
            this.videoId = body.video_id
            this.setLines(lines, duration);
        },
        setLines(lines, duration) {
            let overlap = false
            let lastTo = 0
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.from < lastTo) {
                    console.log('overlap! lf-lt', line.from, lastTo)
                    overlap = true
                }
                lastTo = line.to
            }
            console.log("lines", lines)
            console.log("lines",lines,lines.length)

            for (let i = 0; i < lines.length; i++) {
                let min = ''
                let max = ''
                if (i == 0) {
                    min = 0; max = lines[i + 1].from
                } else if (i == lines.length - 1) {
                    min = lines[i - 1].to
                    max = lines[i].to
                }
                else {
                    min = lines[i - 1].to
                    max = lines[i + 1].from
                }
                lines[i].min = min
                lines[i].max = max
            }
            if (lastTo >= duration) {
                lines[lines.length-1].to = duration
                console.log('Overlap! Seems OpenAI generate srt longer than audio itself, need handle& fix')
                //overlap = true
            }
            if (overlap == false) {
                this.lines = [...lines]
            }
            return overlap
        }
    }
})