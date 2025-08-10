<template>
  <div class="grid grid-cols-15 gap-3">
    <p class="col-span-3 text-sm">Test</p>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { onMounted } from 'vue'

const props = defineProps({
  sales: {
    type: Object,
    default: () => ({})
  }
})

const settingsStore = useSettingsStore()

onMounted(async () => {
  await settingsStore.fetchCategoryTree(89)
})
</script>
