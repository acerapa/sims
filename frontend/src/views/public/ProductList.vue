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
        <ul class="flex gap-1 items-center">
          <li class="relative group" v-for="cat in sampleCategories" :key="cat">
            <RouterLink class="peer py-2 px-3 group-hover:bg-blue-100">
              <p class="whitespace-nowrap">{{ cat.name ? cat.name : cat }}</p>
              <img v-if="cat.items" class="w-3" :src="ArrowDown" alt="" />
            </RouterLink>

            <div
              v-if="cat.items"
              class="header-nav-dropdown cont group-hover:block"
            >
              <nav>
                <ul class="flex flex-col">
                  <li v-for="item in cat.items" :key="item" class="group">
                    <RouterLink
                      to="#"
                      class="p-2 whitespace-nowrap border-b hover:bg-blue-100 hover:border-b-white group-last:border-b-0"
                    >
                      {{ item }}
                    </RouterLink>
                  </li>
                </ul>
              </nav>
            </div>
          </li>
        </ul>
      </nav>

      <div class="mt-3 px-3">
        <p class="text-lg font-medium">Categories</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArrowDown from '@/assets/icons/arrow-down.svg'

const sampleCategories = [
  {
    name: 'Computers',
    items: ['Testing', 'Test']
  },
  {
    name: 'Mobiles',
    items: ['Testing long navigation', 'Yep!']
  },
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
.header-nav-dropdown {
  @apply hidden min-w-40 !p-0 !rounded-none absolute text-sm;
}

.product-category-header {
  @apply py-2;
}

.product-category-header li a {
  @apply flex gap-2 items-center text-sm;
}

.main-header {
  @apply bg-blue-50;
}
</style>
