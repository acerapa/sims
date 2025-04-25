<template>
  <div
    class="w-72 h-screen bg-regular-blue text-white z-30 sticky top-0"
    :class="[
      isInitialLoad
        ? collpaseSideNav
          ? 'w-[66px] min-w-[66px]'
          : 'w-72'
        : collpaseSideNav
          ? 'shrink-side-nav'
          : 'expand-side-nav'
    ]"
  >
    <!-- User Profile -->
    <div class="bg-lighter-blue flex p-3 items-center h-15 relative">
      <!-- toggle collapse button -->
      <button
        class="btn-outline collapse-btn"
        :class="[collpaseSideNav ? 'rotate-180' : 'rotate-180-reverse']"
        @click="onCollapse"
      >
        <img :src="leftArrow" class="w-3" alt="leftArrow.png" />
      </button>
      <div class="flex justify-between items-center gap-3 flex-1">
        <img
          alt="profile"
          class="w-9 h-9 rounded-full cursor-pointer border-2 border-white"
          src="@/assets/images/profile-sample.png"
          @click.stop="showDropdown = true"
        />
        <div
          class="flex-1 cursor-pointer"
          :class="
            isInitialLoad
              ? collpaseSideNav
                ? 'hidden'
                : ''
              : collpaseSideNav
                ? 'fade-out'
                : 'fade-in'
          "
          @click.stop="showDropdown = true"
        >
          <p>Administrator</p>
          <p class="text-xs text-[#ADB3B9]">admin</p>
        </div>
      </div>

      <div class="dropdown flex flex-col" v-if="showDropdown">
        <button
          class="dropdown-item flex gap-2 items-center"
          @click="console.log(`Redirect to the user info page or profile page`)"
        >
          <img
            src="@/assets/icons/settings.svg"
            class="invert"
            alt="setting.svg"
          />
          Profile
        </button>
        <button class="dropdown-item flex gap-2 items-center" @click="onLogout">
          <img
            src="@/assets/icons/logout.png"
            class="invert"
            alt="logout.svg"
          />
          Logout
        </button>
      </div>
    </div>

    <!-- Navigations -->
    <div class="navigations py-5 overflow-y-auto h-[calc(100vh-72px)]">
      <NavRow
        v-for="(nav, ndx) in navs"
        :key="ndx"
        :nav="nav"
        @route-click="onRouteClick"
        :is-collapse="collpaseSideNav"
        :is-initial-load="isInitialLoad"
      />
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app'
import { useRoute, useRouter } from 'vue-router'
import NavRow from './NavRow.vue'
import navs from '@/data/nav'
import { onMounted, ref, watch } from 'vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useAuth } from '@/composables/useAuth'

import leftArrow from '@/assets/icons/arrow-left.svg'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const targetRoutes = ref([])
const appStore = useAppStore()
const authUser = ref({})
const showDropdown = ref(false)
const isInitialLoad = ref(true)

const { collpaseSideNav } = storeToRefs(appStore)

// composables
const { signOut, getAuthUser } = useAuth()

// Custom global event
onMounted(async () => {
  authUser.value = await getAuthUser()
  appStore.getCollpaseSideNav()

  Event.on(
    EventEnum.GLOBAL_CLICK,
    function () {
      showDropdown.value = false
    },
    true
  )
})

const onCollapse = () => {
  isInitialLoad.value = false
  appStore.toggleSideNav()
}

const onLogout = async () => {
  await signOut()
  router.go()
}

const onRouteClick = (name = route.name, hasChild = false) => {
  if (hasChild) {
    name = route.matched[0].redirect.name
  }
  appStore.currentNav = navs.find((r) => r.route == name)
  if (!appStore.currentNav) {
    let children = []
    navs
      .filter((nav) => nav.children)
      .forEach((nav) => {
        children = [...children, ...nav.children]
      })

    appStore.currentNav = children.find((r) => r.route == name)
  }
}

const getIncludeActiveRoutes = (rt) => {
  if (rt.includes_active) {
    rt.includes_active.forEach((iart) => {
      targetRoutes.value.push({
        parent: rt,
        route_name: iart
      })
    })
  }

  if (rt.children) {
    rt.children.forEach((r) => getIncludeActiveRoutes(r))
  }
}

const getActiveRouteBasedIncludes = (route) => {
  const rt = targetRoutes.value.find((r) => r.route_name == route.name)
  if (rt) appStore.currentNav = rt.parent
}

navs.forEach((rt) => getIncludeActiveRoutes(rt))

watch(route, (val) => {
  getActiveRouteBasedIncludes(val)
})

// run function upon loading
onRouteClick()
getActiveRouteBasedIncludes(route)
</script>

<style scoped>
.dropdown {
  @apply absolute max-w-[75%] w-fit bg-white right-0 top-15 rounded shadow text-black;
}

.dropdown-item {
  @apply hover:bg-blue-200 px-3 first:rounded-t last:rounded-b text-sm py-1;
}

.navigations::-webkit-scrollbar {
  width: 10px;
  background-color: rgb(21, 22, 91);
}

.navigations::-webkit-scrollbar-track {
  background-color: #c3c1c1;
}

.navigations::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: #787878;
}

.collpase-nav {
  @apply w-15 min-w-15 flex flex-col justify-center py-3;
  background-color: rgb(21, 22, 91);
}

.collapse-btn {
  @apply !border-2 !bg-blue-300 !border-white !p-2 !rounded-full absolute top-5 -right-4 z-10;
}

.fade-in:not(.initial-) {
  animation: fade-in 0.5s ease-in-out forwards;
}

.fade-out {
  animation: fade-out 0.5s ease-in-out forwards;
}

.rotate-180 {
  animation: rotate-180 0.5s ease-in-out forwards;
}

.rotate-180-reverse {
  animation: rotate-180-reverse 0.5s ease-in-out forwards;
}

.shrink-side-nav {
  animation: shrink 0.5s ease-in-out forwards;
}

.expand-side-nav {
  animation: expand 0.5s ease-in-out forwards;
}

@keyframes shrink {
  0% {
    width: 288px;
  }

  100% {
    width: 66px;
  }
}

@keyframes expand {
  0% {
    width: 66px;
  }
  100% {
    width: 288px;
  }
}
</style>
