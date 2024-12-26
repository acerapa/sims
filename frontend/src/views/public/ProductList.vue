<template>
  <div>
    <header class="main-header">
      <div
        class="flex gap-6 items-center text-gray-800 py-4 max-w-screen-xl mx-auto"
      >
        <div class="flex gap-2 items-center">
          <img src="@/assets/logo-icon.png" class="w-10 h-10" alt="logo" />
          <p class="text-lg font-medium">Ram Tech Ventures</p>
        </div>

        <nav>
          <ul class="flex gap-4 mt-0.5 items-center">
            <li>
              <RouterLink to="#">Home</RouterLink>
            </li>
            <li>
              <RouterLink to="#">Products</RouterLink>
            </li>
            <li>
              <RouterLink to="#">About</RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="mx-auto max-w-screen-xl p-5">
      <h1 class="text-2xl">Products</h1>
      <nav class="product-category-header">
        <ul class="flex gap-3 items-center py-2">
          <li v-for="cat in sampleCategories" :key="cat">
            <RouterLink>
              <p>{{ cat }}</p>
              <img class="w-3" :src="ArrowDown" alt="" />
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import ArrowDown from '@/assets/icons/arrow-down.svg'

const sampleCategories = [
  'Computers',
  'Mobiles',
  'Gadgets',
  'Storage',
  'PC Components',
  'Displays',
  'Periperals',
  'Printers',
  'Networking',
  'Accessories'
]
</script>

<style scoped>
.product-category-header li a {
  @apply flex gap-1 items-center text-sm;
}

.main-header {
  @apply bg-blue-50;
}
</style>
