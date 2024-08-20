<template>
  <div class="bg-white shadow h-15 pl-5 flex items-center">
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
