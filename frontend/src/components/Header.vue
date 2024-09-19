<template>
  <div class="bg-white shadow h-15 pl-5 flex items-center sticky top-0 z-10">
    <p class="text-xl font-bold">
      {{ appStore.currentNav ? appStore.currentNav.text : route.meta.title }}
    </p>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";
const appStore = useAppStore();

const route = useRoute();
</script>
