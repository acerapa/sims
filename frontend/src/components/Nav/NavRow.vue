<template>
  <div class="flex flex-col gap-3">
    <RouterLink
      class="px-5 py-3 flex items-center"
      :to="{ name: props.nav.route }"
      :active-class="`bg-dark-blue font-bold ${props.customActiveClass}`"
      :class="[
        isIncludedRoute(nav)
          ? `bg-dark-blue font-bold exact-active ${props.customActiveClass}`
          : '',
        props.isCollapse ? 'hoverable' : 'gap-3'
      ]"
      @click="emitRouteClick(props.nav.route, props.nav.children)"
    >
      <div
        class="flex items-center text-sm gap-3 flex-1 tracking-wider text-nowrap"
      >
        <img v-if="props.hasIcon" :src="props.nav.icon" alt="" />
        <span
          :class="
            props.isInitialLoad
              ? props.isCollapse
                ? 'hidden'
                : ''
              : props.isCollapse
                ? 'fade-out'
                : 'fade-in'
          "
        >
          {{ props.nav.text }}
        </span>
      </div>

      <img
        v-if="props.nav.children"
        class="w-6 h-6"
        :class="[
          isOpenChildNav() ? '' : '-rotate-90',
          props.isInitialLoad
            ? props.isCollapse
              ? 'hidden'
              : ''
            : props.isCollapse
              ? 'fade-out'
              : 'fade-in'
        ]"
        src="@/assets/icons/carret-down.svg"
        @click="showDropDown"
        alt="carret"
      />
    </RouterLink>

    <!-- /**
     * Renders a dropdown list of child navigation items when a parent navigation item has children
     * and is not in a collapsed state. Each child item is displayed as a RouterLink with an icon
     * and text, with active state styling and click event handling.
     *
     * @remarks
     * - Only shown when parent navigation item has children and is not collapsed
     * - Dynamically applies active styling based on current route
     * - Supports nested navigation with child route links
     */ -->
    <div
      v-if="props.nav.children && !props.isCollapse"
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
        <p class="text-nowrap text-sm">
          {{ child.text }}
        </p>
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
  },
  isCollapse: {
    type: Boolean,
    default: false
  },
  isInitialLoad: {
    type: Boolean,
    default: false
  },
  hasIcon: {
    type: Boolean,
    default: true
  },
  customActiveClass: {
    type: String,
    default: ''
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

.hoverable:hover {
  @apply bg-dark-blue;
}

.fade-in {
  animation: fade-in 0.5s ease-in-out forwards;
}
.fade-out {
  animation: fade-out 0.5s ease-in-out forwards;
}
</style>
