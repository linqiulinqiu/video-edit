<script>
import { mapStores } from 'pinia'
import { useWaveSelStore } from '@/stores/wavesel'
import { usePlayerStore } from '@/stores/player'
import { useSrtStore } from '@/stores/srt'

export default {
    computed: {
        pos(){
            if(this.waveSelStore.pos) return this.waveSelStore.pos
            if(this.playerStore.pos) return this.playerStore.pos
            return 0
        },
        ...mapStores(useWaveSelStore,usePlayerStore, useSrtStore)
    }
}
</script>

<template>
    <div>
        <p>{{ pos.toFixed(2) }}/{{ waveSelStore.duration.toFixed(2) }}</p>
        <p v-if="srtStore.activeLine>=0">{{ srtStore.activeLine }}/{{ srtStore.lines.length }}</p>
        <p v-else>{{  srtStore.lines.length }}</p>
    </div>
</template>