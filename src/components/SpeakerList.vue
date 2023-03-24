
<script>
import { mapState, mapStores, mapActions } from "pinia";
import { useSpStore } from "@/stores/splist";
import SpeakerSetVue from "./speakerModel/speakerSet.vue";
import loadInfo from "../loadInfo";

export default {
  components: {
    SpeakerSetVue,
  },
  computed: {
    ...mapState(useSpStore, ["speakers", "speakerList"]),
    ...mapActions(useSpStore, ["loadlist"]),
    ...mapStores(useSpStore),
  },

  data() {
    return {};
  },
  watch: {
    speakerList: function (newl) {
      console.log("new list", newl);
    },
  },

  async mounted() {
    await this.loadlist("subedit/all-speakers/");
    // await this.spStore.loadSpeakers("/subedit/all-speakers/");
  },
  methods: {
    async loadlist(url) {
      const resp = await loadInfo.getInfo(url);
      this.speakers = [...resp.data];
    },
    delSpeaker(val, idx) {
      this.speakerList.splice(idx, 1);
      console.log("befoe delete :", this.speakerList);
    },
    addSpeaker() {
      this.speakerList.push("4");
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
            <el-col :span="3">名字</el-col>
            <el-col :span="3">性别</el-col>
            <el-col :span="5">示例</el-col>
            <el-col :span="5">删除</el-col>
          </el-row>
        </h2>
      </li>
      <li v-for="(val, idx) in speakerList" :key="idx">
        <el-row>
          <el-col :span="3">
            {{ speakers[val].name }}
            <SpeakerSetVue :val="val" :idx="idx" />
          </el-col>

          <el-col :span="3">{{ speakers[val].gender }} </el-col>
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