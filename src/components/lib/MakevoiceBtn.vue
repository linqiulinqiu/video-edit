<template>
  <el-button :disabled="!this.sid || !this.text" @click="makeVoice()"
    >生成音频</el-button
  >
</template>
<script>
export default {
  props: ["sid", "spkId", "text", "url"],
  methods: {
    async makeVoice() {
      const loading = this.$loading({
        fullscreen: true,
        background: "#9dbfc101",
        text: "音频生成中",
        lock: true,
      });
      const form = new FormData();
      form.append("spk", this.spkId);
      form.append("text", this.text);
      form.append("sid", this.sid);
      form.append(
        "csrf",
        document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content")
      );
      const resp = await fetch("/made-cache/make-voice", {
        body: form,
        method: "POST",
      });
      const resj = await resp.json();
      this.url(resj);

      loading.close();
    },
  },
};
</script>