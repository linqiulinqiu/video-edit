<script>
import { mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import Sublist from "@/components/sublistModel/Sublist.vue";

export default {
  computed: {
    ...mapStores(useSrtStore),
  },
  components: {
    Sublist,
  },
  methods: {
    async loadSrt() {
      await this.srtStore.loadSrt();
    },
    async saveSrt(){
      await this.srtStore.saveSrt();
    },
    async makeAudio(){
      console.log('TODO: make audio')
      alert('TODO: make audio')
    }
  },
};
</script>
<template>
  <el-col>
    <!-- <el-col?> -->
    <el-button @click="loadSrt()">Load</el-button>
    <el-button @click="saveSrt()">Save</el-button>
    <el-button v-if="srtStore.audioOut==false">Make Audio</el-button>
    <!-- </el-col?> -->
    <Sublist />
  </el-col>
</template>