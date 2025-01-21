<template>
  <h1>Services</h1>
</template>

<script setup>
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useProductStore } from '@/stores/product'
import { onMounted } from 'vue'

const productStore = useProductStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

onMounted(async () => {
  await productStore.getServices()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
