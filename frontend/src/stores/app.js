import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";

const authStore = useAuthStore();
export const useAppStore = defineStore("app", () => {
  const currentNav = ref("");
  const currentBranch = ref({});

  return { currentNav };
});
