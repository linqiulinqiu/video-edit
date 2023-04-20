
import { defineStore } from 'pinia'

export const useSrtStore = defineStore('srt', {
    state: () => ({
        stored: {
            spks:[],
            lines: []   
        },
        spks: [],
        lines: [],
        lang_id: 0,
        reflines: [],
        video:{},//video info
        sid: 0,
        audio: [],
        activeLine: -1,
    }),
    getters:{
        tdirty() {   // text related dirty, when it's true, voice make should be enabled
            console.log('call tdirty', this.lines, this.stored)
            if(this.spks.length!=this.stored.spks.length || this.lines.length!=this.stored.lines.length) return true
            for(let i in this.spks){
                if(this.spks[i].speaker_id!=this.stored.spks[i].speaker_id) return true
            }
            for(let i in this.lines){
                if(this.lines[i].text!=this.stored.lines[i].text) return true
            }
            return false
        },
        dirty(){    // any dirty, when true, undo should be enabled
            if(this.tdirty) return true
            for(let i in this.lines){
                if(this.lines[i].start_ms!=this.stored.lines[i].start_ms) return true
                if(this.lines[i].duration_ms!=this.stored.lines[i].duration_ms) return true
            }
            return false
        }
    },
    actions: {
        setSid(sid){
            this.sid = sid
        },
        async loadSrt() {
            const resp = await fetch(`/subedit/subtitle-info/${this.sid}`);
            const body = await resp.json();
            console.log("body:",body)
            const chunks = body.subsnap.chunks
            const lines = [];
            this.lang_id = body.lang_id
            for (var i in chunks) {
                const line = chunks[i];
                const item = {
                    speaker: line.spk,
                    from: line.start_ms / 1000,
                    to: (line.start_ms + line.duration_ms) / 1000,
                };
                item.text = line.body
                lines.push(item)
            }
            if('refchunks' in body && 'en-US' in body.refchunks){
                this.reflines = body.refchunks['en-US']
            }else{
                this.reflines = []
            }
            if(body.subsnap.audio.length == lines.length){
                this.audio = body.subsnap.audio
            }else{
                this.audio = []
            }
            this.video = {
                time: body.video.duration_ms/1000,
                id: body.video.id,
                pathName: body.video.pathName
            }
            console.log("refchunks",this.reflines)
            this.setSpks(body.subsnap.spks)
            this.setLines(lines);
            this.stored = { // TODO: optimize for speed
                spks: JSON.parse(JSON.stringify(body.subsnap.spks)),
                lines: JSON.parse(JSON.stringify(lines))
            }
        },
        async saveSrt(){
            const chunks = []
            for(let i in this.lines){
                const line = this.lines[i]
                const start_ms = parseInt(line.from*1000)
                const item = {
                    spk: line.speaker,
                    start_ms : start_ms,
                    duration_ms: parseInt(line.to*1000)- start_ms,
                    body: line.text
                }
                chunks.push(item)
            }
            const spks = []
            for(let i in this.spks){
                const spk = this.spks[i]
                spks.push({
                    speaker_id: spk.speaker_id,
                    gender: spk.gender,
                    age: spk.age
                })
            }
            const form = new FormData()
            form.append('chunks', JSON.stringify(chunks))
            form.append('spks', JSON.stringify(spks))
            const resp = await fetch(`/subedit/save-snap/${this.sid}`, {
                body: form,
                method: 'POST'
            });
            this.stored = {
                spks: JSON.parse(JSON.stringify(this.spks)),
                lines: JSON.parse(JSON.stringify(this.lines))
            }
            console.log('resp of saveSrt', resp)
        },
        setLine(idx, line){
            const ls = []
            for(let i = 0; i< this.lines.length; i++){
                ls.push( {
                    from:this.lines[i].from,
                    to:this.lines[i].to,
                    speaker: this.lines[i].speaker,
                    text: this.lines[i].text
                })
            }
            line = {
                    from: line.from, 
                    to: line.to,
                    speaker: line.speaker,
                    text: line.text
                }
            if(idx>=ls.length){
                ls.push(line)
            }else{
                ls[idx] = line
            }
            this.setLines(ls)
        },
        setLines(lines) {
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
            if (lastTo >= this.video.time) {
                lines[lines.length - 1].to = this.video.time
                console.log('Overlap! Seems OpenAI generate srt longer than audio itself, need handle& fix')
                overlap = true
            }
            this.lines = [...lines]

            return overlap
        },
        setSpks(spks) {
            this.spks = spks
        },
        undo(){}
    }
})