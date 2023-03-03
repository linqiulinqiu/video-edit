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
        <p>{{ waveSelStore.pos }}</p>
        <p>{{ srtStore.lines.length }}</p>
    </div>
</template>