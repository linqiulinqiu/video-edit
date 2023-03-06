<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { mapStores, mapState } from "pinia";
import { useWaveSelStore } from "@/stores/wavesel";
import { useSrtStore } from "@/stores/srt";
import { iteratee } from 'lodash';

export default {
    computed: {
        ...mapState(useSrtStore, ["activeLine", "lines"]),
        ...mapStores(useWaveSelStore, useSrtStore)
    },
    props: {
        videoAt: String
    },
    data() {
        return {
            player: null,
            playing: false,
            posChecker: null
        }
    },
    watch:{
        activeLine(newAl,oldAl){
            if(this.player){
                if(this.playing){
                    this.player.pause()
                    this.playing = false
                }
                if(newAl<this.lines.length && newAl>=0){
                    this.player.currentTime(this.lines[newAl].from)
                    this.player.play()
                    this.playing = true;
                }
            }
        }
    },
    mounted() {
        if (this.videoAt) {
            const options = {
                controls: true,
                fill: true,
                autoplay: true,
                sources: [{
                    src: this.videoAt,
                    type: 'video/mp4'
                }]
            }
            this.player = videojs(this.$refs.videoPlayer, options, () => {})
            if(!this.posChecker){
                const widget = this
                this.posChecker = setInterval(()=>{
                    if(widget.playing&&widget.player){
                        const ctime = widget.player.currentTime()
                        widget.waveSelStore.pos = ctime
                    }
                },50)
            }
        }
    },
    beforeUnmount() {
        if (this.player) {
            if(this.posChecker){
                clearInterval(this.posChecker)
                this.posChecker = null
            }
            this.player.dispose()
            this.player = null
        }
    }
}
</script>

<template>
    <video ref="videoPlayer" class="video-js" width="400" height="300" data-setup="{}">
    </video>
</template>