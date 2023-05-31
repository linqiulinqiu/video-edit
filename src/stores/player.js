import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    pos: 0,
  }),
});
