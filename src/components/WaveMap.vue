<script>
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

export default {
    mounted() {
        // Initialize WaveSurfer instance
        this.waveform = WaveSurfer.create({
            container: this.$refs.waveform,
            waveColor: '#358',
            progressColor: '#a75',
            plugins: [
                RegionsPlugin.create({})
            ]
        });

        // Load audio file
        this.waveform.load('/audio.mp3');
        this.waveform.on('seek', (position) => {
            console.log('Seek position:', position);
            // Do something with the cursor position, such as update a cursor position display
        });
        this.waveform.on('region-created', (evt) => {
            console.log('Region created:', evt);
            // Do something with the region, such as store it in a data structure for later use
        });
    },
}
</script>

<template>
    <div ref="waveform"></div>
</template>