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

  const isModalExist = (modal) => {
    return Object.keys(modals.value).includes(modal)
  }

  const evaluatePageScopes = (routeData) => {
    const { to } = routeData
    Object.keys(pages.value).forEach((key) => {
      if (!pages.value[key].route_scope.includes(to.name)) {
        removePage(key)
      }
    })
  }

  const evaluateModalScopes = (routeData) => {
    const { to } = routeData
    Object.keys(modals.value).forEach((key) => {
      if (!modals.value[key].route_scope.includes(to.name)) {
        removeModal(key)
      }
    })
  }

  const removePage = (page) => {
    delete pages.value[page]
  }

  const removeModal = (modal) => {
    delete modals.value[modal]
  }

  return {
    pages,
    modals,
    currentNav,
    currentBranch,

    removePage,
    removeModal,
    isPageExist,
    isModalExist,
    setPageState,
    setModalState,
    evaluatePageScopes,
    evaluateModalScopes
  }
})
