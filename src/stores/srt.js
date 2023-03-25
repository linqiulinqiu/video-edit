import { defineStore } from 'pinia'
import * as srtparsejs from "srtparsejs";
import queryString from "query-string";

export const useSrtStore = defineStore('srt', {
    state: () => ({
        id: 0,
        lines: [],
        spks:[],
        activeLine: -1
    }),
    actions: {
        async load() {
            const qs = queryString.parse(location.search)
            if ('sid' in qs) {
                const sid = parseInt(qs.sid)
                if (sid) {
                    const resp = await fetch(`/subedit/subtitle-info/${sid}`);
                    const data = resp.data
                    const chunks = data.subsnap.chunks
                    //const video_id = data.video_id
                    //const revision = data.subsnap.revision
                    this.spks = data.subsnap.spks
                    //const audio_lens = data.subsnap.audio_lens
                    //const subtitle_id = data.subsnap.subtitle_id

                    const lines = []
                    for (let i = 0; i < chunks.length; i++) {
                        const line = chunks[i]
                        const item = {
                            speaker: line.apk,
                            text: line.body,
                            from: srtparsejs.toMS(line.start_ms) / 1000,
                            to: srtparsejs.toMS(line.start_ms + line.duration) / 1000,
                        }
                        lines.push(item)
                    }
                    this.setLines(lines, duration)
                }
            }
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
            console.log("set lines", lines)

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
                lines[lines.length - 1].to = duration
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