import { defineStore } from 'pinia'

export const useSrtStore = defineStore('srt', {
    state: ()=>({
        lines: [
            { speaker: 1, from: 0, to:0.3, textZh:'你好', textEn:'Hello' },
            { speaker: 1, from: 0.35, to:0.7, textZh:'世界', textEn:'World' }
        ],
        activeLine:-1
    })
})