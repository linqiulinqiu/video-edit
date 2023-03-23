
<script>
import { mapState, mapStores } from "pinia";
import { useSpStore } from "@/stores/splist";
export default {
  computed: {
    ...mapState(useSpStore, ["speakers"]),
    ...mapStores(useSpStore),
  },
  data() {
    return {
      speakerList: [3, 5, 2], // id for speakers[id]
    };
  },
  methods: {
    setSpeaker(id, idx) {
      console.log("value = ", id, idx);
      // this.speakerList[idx] = v;
      // console.log("speaker", this.speakerList, "value --idx :", v, idx);
      // this.speakerList = [...this.speakerList];
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
            <el-col :span="5">设置</el-col>
          </el-row>
        </h2>
      </li>
      <li v-for="(v, k, idx) in speakerList" :key="idx">
        <el-row>
          <el-col :span="3">Name={{ speakers[v].name }} </el-col>
          <el-col :span="3">Gender={{ speakers[v].gender }} </el-col>
          <el-col :span="5"
            ><a href="">Sample{{ idx }} </a></el-col
          >
          <el-col :span="5"
            ><button>Delete (delete this, and move all rest up)</button></el-col
          >
          <el-col :span="5"
            ><el-select
              :value="v"
              @change="
                (v) => {
                  setSpeaker(v, idx);
                }
              "
            >
              <el-option
                v-for="item in speakers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option> </el-select
          ></el-col>
        </el-row>
      </li>
    </ul>
    <el-button>Add New Speaker</el-button>
    <el-button class="save-btn">保存</el-button>
  </el-col>
</template>
<style>
.save-btn {
  /* margin-top: 30px; */
}
</style>