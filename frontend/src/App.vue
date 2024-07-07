<script setup>
import { RouterView } from "vue-router";
import { onMounted } from "vue";
import Event from "./event";

onMounted(() => {
  window.addEventListener("click", () => {
    Event.emit("global-click");
  });
});
</script>

<template>
  <RouterView />
</template>
