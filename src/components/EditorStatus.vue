<script>
import { mapStores } from 'pinia'
import { useWaveSelStore } from '@/stores/wavesel'
import { useSrtStore } from '@/stores/srt'

export default {
    computed: {
        ...mapStores(useWaveSelStore,useSrtStore)
    }
}
</script>

<template>
    <div>
        <p>{{ waveSelStore.pos.toFixed(2) }}/{{ waveSelStore.duration.toFixed(2) }}</p>
        <p v-if="srtStore.activeLine>=0">{{ srtStore.activeLine }}/{{ srtStore.lines.length }}</p>
        <p v-else>{{  srtStore.lines.length }}</p>
    </div>
</template>