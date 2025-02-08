import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingsStore } from './settings'

export const useAppStore = defineStore('app', () => {
  const settingsStore = useSettingsStore()

  const currentNav = ref('')
  const currentBranch = computed(() =>
    settingsStore.branches.find((branch) => branch.is_current)
  )

  const pages = ref({})
  const modals = ref({})

  const setPageState = (page, state) => {
    pages.value[page] = state
  }

  const setModalState = (modal, state) => {
    modals.value[modal] = state
  }

  const isPageExist = (page) => {
    return Object.keys(pages.value).includes(page)
  }

  return {
    pages,
    modals,
    currentNav,
    currentBranch,

    isPageExist,
    setPageState,
    setModalState
  }
})
