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
    localStorage.setItem(pageState, JSON.stringify(pages.value))
  }

  const setModalState = (modal, state) => {
    modals.value[modal] = state
    localStorage.setItem(modalState, JSON.stringify(modals.value))
  }

  const getPageState = (page) => {
    getPageStateFromLS()
    return pages.value[page]
  }

  const getModalState = (modal) => {
    getModalStateFromLS()
    return modals.value[modal]
  }

  const isPageExist = (page) => {
    getPageStateFromLS()
    return Object.keys(pages.value).includes(page)
  }

  const isModalExist = (modal) => {
    getModalStateFromLS()
    return Object.keys(modals.value).includes(modal)
  }

  const evaluatePageScopes = (routeData) => {
    getPageStateFromLS()
    const { to } = routeData
    Object.keys(pages.value).forEach((key) => {
      if (!pages.value[key].route_scope.includes(to.name)) {
        removePage(key)
      }
    })

    localStorage.setItem(pageState, JSON.stringify(pages.value))
  }

  const evaluateModalScopes = (routeData) => {
    getModalStateFromLS()
    const { to } = routeData
    Object.keys(modals.value).forEach((key) => {
      if (!modals.value[key].route_scope.includes(to.name)) {
        removeModal(key)
      }
    })
    localStorage.setItem(modalState, JSON.stringify(modals.value))
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
