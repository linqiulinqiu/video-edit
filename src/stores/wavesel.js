import { defineStore } from 'pinia'

export const useWaveSelStore = defineStore('waveSel', {
    state: ()=>({
        pos: 0,
        sels: [0,0],
        duration: 0
    }),
    actions: {
        setPos(pos){
            this.pos = pos
        },
        sel(from, to){
            if(from>=0&&to<=1&&from<to){
                this.sels = [from,to]
            }
        },
        unsel(){
            this.sels = [0,0]
        }
    }
})