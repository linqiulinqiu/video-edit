import { defineStore } from 'pinia'
import * as srtparsejs from "srtparsejs";

export const useSrtStore = defineStore('srt', {
    state: () => ({
        lines: [],
        activeLine: -1
    }),
    actions: {
        async loadSrt(url,duration, lang) {
            const resp = await fetch(url);
            const body = await resp.text();
            const srt = srtparsejs.parse(body);
            const lines = [];
            for (var i in srt) {
                const line = srt[i];
                const item = {
                    speaker: 1,
                    from: srtparsejs.toMS(line.startTime) / 1000,
                    to: srtparsejs.toMS(line.endTime) / 1000,
                };
                if(lang=='en'){
                    item.textEn = line.text
                }else if(lang =='zh'){
                    item.textZh = line.text
                }
                lines.push(item)
            }
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