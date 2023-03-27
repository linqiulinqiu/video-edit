
<script>
import { mapState, mapStores, mapActions } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useSpStore } from "@/stores/splist";
import SpeakerSetVue from "./speakerModel/speakerSet.vue";

export default {
  components: {
    SpeakerSetVue,
  },
  computed: {
    ...mapState(useSpStore, ["speakerList"]), // 以此确保本Component不会改动spList.speakerList(仅能读入，不可修改)
    ...mapState(useSrtStore, ["spks"]),
    ...mapStores(useSrtStore),
  },
  watch: {
    spks(news) {
      console.log("spks changed", news, this.spks.length);
    },
  },
  methods: {
    delSpeaker(val, idx) {
      this.spks.splice(idx, 1);
      this.srtStore.setSpks(this.spks);
      //
    },
    addSpeaker() {
      //TODO: add item to srtStore.spks
      const item = { speaker_id: 8 };
      this.spks.push(item);
      this.srtStore.setSpks(this.spks);
    },
  },
};
</script>
<template>
  <el-col>
    <ul>
      <li>
        <h2>
          <el-row>
            <el-col :span="3">ID</el-col>
            <el-col :span="3">姓名</el-col>

            <el-col :span="3">性别</el-col>
            <el-col :span="5">示例</el-col>
            <el-col :span="5">删除</el-col>
          </el-row>
        </h2>
      </li>
      <li v-for="(spk, idx) in spks" :key="idx">
        <el-row>
          <el-col :span="3">
            {{ spk.speaker_id }}
            <SpeakerSetVue :spks="spks" :idx="idx" />
          </el-col>
          <el-col :span="3">{{ spk.name }}</el-col>
          <el-col :span="3">{{ spk.gender }} </el-col>
          <el-col :span="5"
            ><a href="">idx : {{ idx }} </a></el-col
          >
          <el-col :span="5"
            ><el-button @click="delSpeaker(val, idx)"
              >Delete (delete this, and move all rest up)</el-button
            ></el-col
          >
        </el-row>
      </li>
    </ul>
    <el-button @click="addSpeaker()">Add New Speaker</el-button>
    <el-button class="save-btn">保存</el-button>
  </el-col>
</template>
<style>
.save-btn {
  /* margin-top: 30px; */
}
</style>