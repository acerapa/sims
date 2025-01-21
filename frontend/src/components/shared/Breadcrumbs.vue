<template>
  <div class="cont flex gap-3 items-center" v-if="route.name != 'dashboard'">
    <button class="btn !p-2 !rounded-full" @click="onBack">
      <img :src="leftArrow" class="w-4" alt="" />
    </button>
    <div class="flex gap-3">
      <div
        class="flex gap-2 group"
        v-for="routeName in activeRoutes"
        :key="routeName"
      >
        <RouterLink
          :to="{ name: routeName }"
          class="group-last:pointer-events-none group-last:font-normal font-semibold"
        >
          {{
            routeName
              .replaceAll('-', ' ')
              .split(' ')
              .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1)
              })
              .join(' ')
          }}
        </RouterLink>

        <p class="group-last:hidden">\</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import navs from '@/data/nav/index'

const route = useRoute()
const router = useRouter()

// back button icon
import leftArrow from '@/assets/icons/arrow-left.svg'
import { onMounted, ref, watch } from 'vue'

const onBack = () => router.back()
const activeRoutes = ref([])

const getRoutesHistory = (nav) => {
  if (nav.route == route.name) {
    activeRoutes.value.push(nav.route)
  } else {
    if (nav.includes_active) {
      if (nav.includes_active.includes(route.name)) {
        activeRoutes.value.push(nav.route, route.name)
      }
    }

    if (nav.children) {
      const isInChild = nav.children.find((child) => {
        if (child.route == route.name) {
          return true
        }

        if (child.includes_active) {
          if (child.includes_active.includes(route.name)) {
            return true
          }
        }

        return false
      })

      if (isInChild) {
        activeRoutes.value.push(nav.route)
      }

      nav.children.forEach((child) => {
        getRoutesHistory(child)
      })
    }
  }
}

onMounted(() => {
  activeRoutes.value = []
  navs.forEach((nav) => {
    getRoutesHistory(nav)
  })
})

watch(
  () => route.name,
  (val) => {
    activeRoutes.value = []
    navs.forEach((nav) => {
      getRoutesHistory(nav)
    })
  }
)
</script>
