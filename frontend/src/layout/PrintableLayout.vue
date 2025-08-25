<template>
  <div class="bg-slate-100 flex justify-center h-screen p-10 print:p-0">
    <div class="lg:max-w-7xl w-full flex flex-col gap-3">
      <div class="flex justify-between items-center print:hidden">
        <div class="flex items-center gap-3">
          <button class="btn !p-2 !rounded-full" @click="onBack">
            <img :src="leftArrow" class="w-4" alt="" />
          </button>
          <p>{{ filename }}</p>
        </div>
        <button class="btn" @click="onPrint">Print</button>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import leftArrow from '@/assets/icons/arrow-left.svg'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const filename = route.meta.filename
  ? route.meta.filename
  : 'No filename indicated'

/** ================================================
 * METHODS
 ** ================================================*/
const onBack = () => {
  router.back()
}

const onPrint = () => {
  window.print()
}
</script>

<style scoped>
@media print {
  body {
    font-family: 'Arial Narrow', 'Helvetica Neue', sans-serif;
  }

  @page {
    margin: 24px 12px;
  }
}
</style>
