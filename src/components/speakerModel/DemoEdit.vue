<template>
  <el-col>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-select v-model="spkId" placeholder="Speaker ID">
          <el-option
            v-for="spk in speakerList"
            :key="spk.name"
            :value="spk.id"
            :label="spk.id + ' -- ' + spk.name + ' -- ' + spk.gender"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="9"
        ><el-input
          type="text"
          v-model="voiceTxt"
          placeholder="自定义内容"
          clearable
          maxlength="40"
          minlength="2"
          :show-word-limit="true"
      /></el-col>
      <el-col :span="2">
        <MakevoiceBtn
          :sid="sid"
          :text="voiceTxt"
          :spkId="spkId"
          :url="updateUrl"
        />
      </el-col>
      <el-col :span="4">
        <audio controls :src="url"></audio>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
import { mapState, mapStores } from "pinia";
import { useSrtStore } from "@/stores/srt";
import { useSpStore } from "@/stores/splist";
import MakevoiceBtn from "../lib/MakevoiceBtn.vue";

export default {
  components: {
    MakevoiceBtn,
  },
  computed: {
    ...mapState(useSpStore, ["speakerList"]),
    ...mapState(useSrtStore, ["sid"]),
  },
  data() {
    return {
      spkId: "",
      url: "",
      voiceTxt: "",
    };
  },
  methods: {
    updateUrl(e) {
      if ("url" in e) {
        this.url = e.url;
      }
    },
  },
};
</script>