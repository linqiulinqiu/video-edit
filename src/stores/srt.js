import { defineStore } from 'pinia'

export const useSrtStore = defineStore('srt', {
    state: () => ({
        lines: [],
        activeLine: -1
    }),
    actions: {
        setLines(lines, duration) {
            let overlap = false
            let lastTo = 0
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                if (line.from < lastTo) {
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
                    min = lines[i-1].to
                    max = lines[i].to
                }
                else {
                    min = lines[i - 1].to
                    max = lines[i+1].from
                }
                lines[i].min = min
                lines[i].max = max
            }
            if (lastTo >= duration) {
                overlap = true
            }
            if (overlap == false) {
                this.lines = [...lines]
            }
            return overlap
        }
    }
})