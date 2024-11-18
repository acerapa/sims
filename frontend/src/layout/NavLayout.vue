<template>
  <SideNav />
  <div class="bg-gray-50 h-screen">
    <div class="flex-1 ml-64">
      <Header />
      <div class="w-full px-5 mt-5">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import SideNav from '@/components/Nav/SideNav.vue'
</script>
