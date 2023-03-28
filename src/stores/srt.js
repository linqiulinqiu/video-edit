import { defineStore } from 'pinia'
import { useSpStore } from './splist';

export const useSrtStore = defineStore('srt', {
    state: () => ({
        spks: [],
        lines: [],
        videoId: 0,
        sid: 0,
        activeLine: -1
    }),
    actions: {
        setSid(sid){
            this.sid = sid
        },
        async loadSrt(duration) {
            const resp = await fetch(`/subedit/subtitle-info/${this.sid}`);
            const body = await resp.json();
            console.log("body:",body)
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
            this.spks = body.subsnap.spks

            this.setSpks(this.spks)
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
                lines[lines.length - 1].to = duration
                console.log('Overlap! Seems OpenAI generate srt longer than audio itself, need handle& fix')
                //overlap = true
            }
            if (overlap == false) {
                this.lines = [...lines]
            }
            return overlap
        },
        setSpks(spks) {
            const sysList = useSpStore().speakerList
            for (var i in spks) {
                for (var j in sysList) {
                    if (spks[i].speaker_id == sysList[j].id) {
                        spks[i]['name'] = sysList[j].name
                        spks[i].gender= sysList[j].gender
                    }
                }
            }
            this.spks = spks
        }

    }
})