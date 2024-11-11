import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingsStore } from './settings'

const settingsStore = useSettingsStore()
export const useAppStore = defineStore('app', () => {
  const currentNav = ref('')
  const currentBranch = computed(() =>
    settingsStore.branches.find((branch) => branch.is_current)
  )

  return { currentNav, currentBranch }
})
