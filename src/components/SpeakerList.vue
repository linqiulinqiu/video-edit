
<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useSpStore } from "@/stores/splist";
import SpeakerSetVue from "./speakerModel/SpeakerSet.vue";
import VoiceDemoVue from "./speakerModel/VoiceDemo.vue";

export default {
  components: {
    SpeakerSetVue,
    VoiceDemoVue,
  },
  computed: {
    ...mapState(useSpStore, ["speakerList"]), // 以此确保本Component不会改动spList.speakerList(仅能读入，不可修改)
    ...mapState(useSrtStore, ["spks", "lines"]),
    ...mapStores(useSrtStore),
  },
  watch: {},
  methods: {
    detectSpeaker(index) {
      let isDelete = true;
      for (let i in this.lines) {
        const line_sp = this.lines[i].speaker;
        if (line_sp == index) {
          isDelete = false;
        }
      }
      if (!isDelete) {
        this.$message({
          message: "当前说话人正在使用中，不可删除",
          type: "warning",
        });
      }
      return isDelete;
    },
    delSpeaker(val, idx) {
      const isOk = this.detectSpeaker(idx);
      if (isOk) {
        this.spks.splice(idx, 1);
        this.srtStore.setSpks(this.spks);
      }
    },
    addSpeaker() {
      if (this.spks.length >= this.speakerList.length) {
        this.$message({
          message: "人数已超过系统设置人数",
          type: "warning",
        });
        return;
      }
      const list = this.speakerList.concat();

      for (let i in list) {
        for (let spk in this.spks) {
          if (list[i].id == this.spks[spk].speaker_id) {
            list.splice(i, 1);
          }
        }
      }
      const item = { speaker_id: list[0].id };
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
      <li v-for="(spk, idx) in spks" :key="spk.name">
        <el-row>
          <el-col :span="3">
            {{ spk.speaker_id }}
            <SpeakerSetVue :spks="spks" :idx="idx" />
          </el-col>
          <el-col :span="3">{{ speakerList[spk.speaker_id].name }}</el-col>
          <el-col :span="3">{{ speakerList[spk.speaker_id].gender }} </el-col>
          <el-col :span="5">
            <VoiceDemoVue :url="speakerList[spk.speaker_id].demo" />
          </el-col>
          <el-col :span="5"
            ><el-button @click="delSpeaker(spk.speaker_id, idx)"
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