<template>
  <PageLoader v-if="isPageLoading" />
  <RouterView />
</template>

<script setup>
import Event from './event'
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { EventEnum } from './data/event'
import PageLoader from './components/shared/PageLoader.vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()

onMounted(() => {
  window.addEventListener('click', () => {
    Event.emit(EventEnum.GLOBAL_CLICK)
  })
})

const isPageLoading = ref(false)

Event.on(EventEnum.IS_PAGE_LOADING, function (isLoading) {
  isPageLoading.value = isLoading
})

// Check for the route changing event
Event.on(EventEnum.ROUTE_CHANGE, function (routeData) {
  appStore.evaluatePageScopes(routeData)
  appStore.evaluateModalScopes(routeData)
})
</script>
