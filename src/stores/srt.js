import { defineStore } from 'pinia'
import * as srtparsejs from "srtparsejs";
import loadInfo from '../loadInfo';
import { useSpStore } from './splist';
export const useSrtStore = defineStore('srt', {
    state: () => ({
        lines: [],
        activeLine: -1
    }),
    actions: {
        async loadSrt(url,duration) {
            // const resp = await fetch(url);
            const sid = loadInfo.getSid();
            if (sid) {
                url = url + sid
                const resp =await loadInfo.getInfo(url);
                console.log('in loadSrt,resp = ',resp.data)
                // const lang = {
                //     name: resp.lang.name,
                //     lcname:resp.lang.lcname
                // }
                const chunks = resp.data.subsnap.chunks
                const video_id = resp.data.video_id
                const revision = resp.data.subsnap.revision
                const spks = resp.data.subsnap.spks
                useSpStore.speakerList = spks
                const subtitle_id = resp.data.subsnap.subtitle_id

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
                this.setLines(lines,duration)
            }

            // const body = await resp.text();
            // const srt = srtparsejs.parse(body);
            // const lines = [];
            // for (var i in srt) {
            //     const line = srt[i];
            //     const item = {
            //         speaker: 1,
            //         from: srtparsejs.toMS(line.startTime) / 1000,
            //         to: srtparsejs.toMS(line.endTime) / 1000,
            //     };
            //     if(lang=='en'){
            //         item.textEn = line.text
            //     }else if(lang =='zh'){
            //         item.textZh = line.text
            //     }
            //     lines.push(item)
            // }
            // this.setLines(lines, duration);
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