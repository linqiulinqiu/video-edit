<script>
import { mapStores } from 'pinia'
import { useWaveSelStore } from '@/stores/wavesel'

import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import { createDOMCompilerError } from '@vue/compiler-dom';


export default {
    computed: {
        // WaveSel
        ...mapStores(useWaveSelStore)
    },
    data (){
        return {
            playing: false
        }
    },
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
        this.waveform.on('seek', this.updatePos)
        this.waveform.on('audioprocess', this.updatePos)
        this.waveform.on('play', ()=>{
            this.playing = true
        })
        this.waveform.on('finish', ()=>{
            this.playing = false
        })

        this.waveform.on('region-created', (evt) => {
            console.log('Region created:', evt)
            // Do something with the region, such as store it in a data structure for later use
        });
    },
    methods:{
        updatePos(){
            this.waveSelStore.setPos(this.waveform.getCurrentTime())
        },
        togglePlay(){
            if(this.waveform.isPlaying()){
                this.waveform.stop()
            }else{
                this.waveform.play()
            }
        }
    }
}
</script>

<template>
    <div>
        <div ref="waveform"></div>
        <div>
            <button v-on:click="togglePlay"><span v-if='playing'>Stop</span><span v-else>Play</span></button>
        </div>
    </div>
</template>