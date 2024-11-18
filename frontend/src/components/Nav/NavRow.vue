<template>
  <div class="flex flex-col gap-3">
    <RouterLink
      class="px-5 py-3 flex gap-3 items-center"
      :to="{ name: props.nav.route }"
      active-class="bg-dark-blue font-bold"
      @click="emitRouteClick(props.nav.route, props.nav.children)"
    >
      <div class="flex-1 flex gap-3">
        <img :src="props.nav.icon" alt="" />
        {{ props.nav.text }}
      </div>
      <img
        v-if="props.nav.children"
        class="w-6 h-6"
        :class="isOpenChildNav() ? '' : '-rotate-90'"
        src="@/assets/icons/carret-down.svg"
        @click="showDropDown"
        alt="carret"
      />
    </RouterLink>
    <div
      v-if="props.nav.children"
      class="flex-col gap-3 pl-8"
      :class="isOpenChildNav() ? '!flex' : 'hidden'"
    >
      <RouterLink
        v-for="(child, child_ndx) in props.nav.children"
        :key="child_ndx"
        class="px-5 py-2 flex gap-3 w-fit rounded-lg text-sm"
        :class="
          isIncludedRoute(child) ? 'bg-dark-blue font-bold exact-active' : ''
        "
        :to="{ name: child.route }"
        :active-class="'bg-dark-blue font-bold'"
        exact-active-class="exact-active"
        @click="emitRouteClick(child.route, child.children)"
      >
        <img :src="child.icon" class="outline-dot" alt="dot" />
        <img :src="dot" class="dot" alt="dot" />
        {{ child.text }}
      </RouterLink>
    </div>
  </div>
</template>
<script setup>
import dot from '@/assets/icons/dot.svg'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'

const appStore = useAppStore()

const props = defineProps({
  nav: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['routeClick'])
const route = useRoute()

const isOpenChildNav = () => {
  const parent = route.matched.find(
    (rt) => rt.children.length && props.nav.route == rt.name
  )
  return parent
}

const emitRouteClick = (nav, hasChild) => {
  setTimeout(() => {
    emit('routeClick', nav, hasChild)
  }, 200)
}

const isIncludedRoute = (rt) => {
  return (
    appStore.currentNav &&
    appStore.currentNav.includes_active &&
    appStore.currentNav.includes_active.includes(route.name) &&
    rt.route == appStore.currentNav.route
  )
}
</script>

<style scoped>
.exact-active .outline-dot {
  display: none;
}
.exact-active .dot {
  display: block;
}

.dot {
  display: none;
}
</style>
