<template>
  <div class="flex fixed w-full overflow-auto">
    <SideNav />
    <div class="bg-gray-50 h-screen flex-1">
      <div class="flex-1">
        <Header />
        <div class="w-full px-5 mt-5 flex flex-col gap-4">
          <Breadcrumbs />
          <RouterView />
        </div>
      </div>
      <ToastComponent />
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import SideNav from '@/components/Nav/SideNav.vue'
import Breadcrumbs from '@/components/shared/Breadcrumbs.vue'
import ToastComponent from '@/components/shared/ToastComponent.vue'
</script>
