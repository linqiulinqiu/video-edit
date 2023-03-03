import { defineStore } from 'pinia'

export const useSrtStore = defineStore('srt', {
    state: ()=>({
        lines: [
            { speaker: 1, from: 0, to:0.1, textZh:'你好', textEn:'Hello' },
            { speaker: 1, from: 0.15, to:0.2, textZh:'世界', textEn:'World' }
        ]
    })
})