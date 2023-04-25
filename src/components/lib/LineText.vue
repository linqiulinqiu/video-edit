<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    props() {
        
    },
    data(){
        text: 'props',
        index: 'props'
    },
    watch:{
        text(newText){
            setLine()
        }
    }
})
</script>

<template>
    <el-input v-model="text">
</template>