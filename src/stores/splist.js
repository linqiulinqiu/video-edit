import { defineStore } from 'pinia'

// need to clarify what this store MEAN: 需清楚本store的含义，目前认为是系统说话人列表
// 跟随字幕的索引表不应保存在此，而应保存到字幕信息，即SRT中。
export const useSpStore = defineStore('spList', {
    state: () => ({
        speakerList: [],
    }),
    actions: {
        async load() {
            const resp = await fetch('/subedit/all-speakers');
            const data = await resp.json()
            const speakers = []
            for (let i = 0; i < data.length; i++) {
                const current = data[i]
                const src_demo = "/storage/samples/"+current.id+"-zh-CN"
                // const demoVoice = await fetch(src_demo)
                const item = {
                    id: current.id,
                    name: current.name,
                    gender: '-',
                    demo:src_demo+'.mp3'
                }
                if (current.gender == 'f') {
                    item.gender = '女'
                }
                if (current.gender == 'm') {
                    item.gender = '男'
                }
                speakers.push(item)
            }
            this.speakerList = speakers
        },
        setSpeakerList(list) {
            this.speakerList =list
        }
    }
})