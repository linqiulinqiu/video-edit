import { defineStore } from 'pinia'

export const useSpStore = defineStore('spList', {
    state: () => ({
        speakers: [
            { id: 0, name: '00-Ana', gender: "男", demo: "aa" },
            { id: 1, name: '01-Betty', gender: "女", demo: "bb" },
            { id: 2, name: '02-Carol', gender: "男", demo: "cc" },
            { id: 3, name: '03-Daniel', gender: "女", demo: "dd" },
            { id: 4, name: '04-Emma', gender: "男", demo: "ee" },
            { id: 5, name: '05-Francisco', gender: "女", demo: "ff" }
        ]
    })
})