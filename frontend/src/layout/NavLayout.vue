<template>
  <SideNav />
  <div class="bg-gray-50 h-screen">
    <div class="flex-1 ml-64">
      <Header />
      <div class="w-full px-5 mt-5 flex flex-col gap-4">
        <div
          class="cont flex gap-3 items-center"
          v-if="route.name != 'dashboard'"
        >
          <button class="btn !p-2 !rounded-full" @click="onBack">
            <img :src="leftArrow" class="w-4" alt="" />
          </button>
          <p>Breadcrumbs should be here</p>
        </div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import SideNav from '@/components/Nav/SideNav.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// back button icon
import leftArrow from '@/assets/icons/arrow-left.svg'

const onBack = () => router.back()
</script>
