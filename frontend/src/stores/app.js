import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingsStore } from './settings'

export const useAppStore = defineStore('app', () => {
  const settingsStore = useSettingsStore()

  const currentNav = ref('')
  const currentBranch = computed(() =>
    settingsStore.branches.find((branch) => branch.is_current)
  )

  // Localstorage keys
  const pageState = 'page-state'
  const modalState = 'modal-state'

  const pages = ref({})
  const modals = ref({})

  const setPageState = (page, state) => {
    pages.value[page] = state
  }

  const setModalState = (modal, state) => {
    modals.value[modal] = state
  }

  const getPageState = (page) => {
    return pages.value[page]
  }

  const getModalState = (modal) => {
    return modals.value[modal]
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

  // private methods
  const getPageStateFromLS = () => {
    const strPages = localStorage.getItem(pageState)
    if (strPages) pages.value = JSON.parse(strPages)
  }

  const getModalStateFromLS = () => {
    const strModals = localStorage.getItem(modalState)
    if (strModals) modals.value = JSON.parse(strModals)
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

    isPageExist,
    isModalExist,
    setPageState,
    getPageState,
    setModalState,
    getModalState,
    evaluatePageScopes,
    evaluateModalScopes
  }
})
