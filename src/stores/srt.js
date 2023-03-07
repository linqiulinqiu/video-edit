import { defineStore } from 'pinia'

export const useSrtStore = defineStore('srt', {
    state: () => ({
        lines: [],
        activeLine: -1
    }),
})