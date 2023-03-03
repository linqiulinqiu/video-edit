import { defineStore } from 'pinia'

export const useSrtStore = defineStore('srt', {
    state: ()=>({
        lines: [
            { speaker: 1, from: 0, to:0.3, textZh:'你好', textEn:'Hello' },
            { speaker: 1, from: 0.35, to: 0.7, textZh: '世界', textEn: 'World' },
            { speaker: 1, from: 0.75, to:1.0, textZh:'欢迎你', textEn:'You are wellcome' },
            { speaker: 1, from: 1.05, to:1.35, textZh:'很高兴你的到来', textEn:'I am glad you came' },
            { speaker: 1, from: 1.4, to:1.7, textZh:'期待你的回访', textEn:'Look forward to your return visit' }

        ],
        activeLine:-1
    }),
})