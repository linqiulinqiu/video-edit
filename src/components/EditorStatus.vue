<script>
import { mapStores } from 'pinia'
import { useWaveSelStore } from '@/stores/wavesel'

export default {
    computed: {
        ...mapStores(useWaveSelStore)
    }
}
</script>

<template>
    <div>
        <p>{{ waveSelStore.pos }}</p>
    </div>
</template>