<template>
  <div class="w-72 fixed h-screen bg-regular-blue text-white z-30">
    <!-- User Profile -->
    <div class="bg-lighter-blue flex p-3 items-center h-15 relative">
      <div class="flex-1 cursor-pointer" @click.stop="showDropdown = true">
        <p>Administrator</p>
        <p class="text-xs text-[#ADB3B9]">admin</p>
      </div>
      <img
        class="w-12 h-12 rounded-full cursor-pointer"
        src="@/assets/images/profile-sample.png"
        alt="profile"
        @click.stop="showDropdown = true"
      />
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

const route = useRoute()
const router = useRouter()
const targetRoutes = ref([])
const appStore = useAppStore()
const showDropdown = ref(false)

// composables
const { signOut } = useAuth()

// Custom global event
onMounted(() => {
  Event.on(
    EventEnum.GLOBAL_CLICK,
    function () {
      showDropdown.value = false
    },
    true
  )
})

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
</style>
