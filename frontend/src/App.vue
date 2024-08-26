<template>
  <PageLoader v-if="isPageLoading" />
  <RouterView />
</template>

<script setup>
import Event from "./event";
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { EventEnum } from "./data/event";
import PageLoader from "./components/shared/PageLoader.vue";

onMounted(() => {
  window.addEventListener("click", () => {
    Event.emit(EventEnum.GLOBAL_CLICK);
  });
});

const isPageLoading = ref(false);

// TODO: Lets create a const or enum to store this event names
Event.on(EventEnum.IS_PAGE_LOADING, function (isLoading) {
  isPageLoading.value = isLoading;
});
</script>
