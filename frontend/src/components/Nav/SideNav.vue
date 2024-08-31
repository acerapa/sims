<template>
  <div class="w-64 fixed h-screen bg-regular-blue text-white">
    <!-- User Profile -->
    <div class="bg-lighter-blue flex p-3 items-center h-15 relative">
      <div class="flex-1 cursor-pointer" @click.stop="showDropdown = true">
        <p>Administrator</p>
        <p class="text-xs text-[#ADB3B9]">admin</p>
      </div>
      <img
        class="w-12 h-12 rounded-full cursor-pointer"
        src="../../assets/images/profile-sample.png"
        alt="profile"
        @click.stop="showDropdown = true"
      />
      <div class="dropdown flex flex-col" v-if="showDropdown">
        <button
          class="dropdown-item flex gap-2 items-center"
          @click="console.log(`Redirect to the user info page or profile page`)"
        >
          <img
            src="../../assets/icons/settings.svg"
            class="invert"
            alt="setting.svg"
          />
          Profile
        </button>
        <button class="dropdown-item flex gap-2 items-center" @click="onLogout">
          <img
            src="../../assets/icons/logout.png"
            class="invert"
            alt="logout.svg"
          />
          Logout
        </button>
      </div>
    </div>

    <!-- Navigations -->
    <div class="mt-5 overflow-y-auto h-[calc(100vh-92px)]">
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
import { useAppStore } from "@/stores/app";
import { useRoute, useRouter } from "vue-router";
import NavRow from "./NavRow.vue";
import navs from "@/data/nav";
import { onMounted, ref, watch } from "vue";
import Event from "@/event";
import { EventEnum } from "@/data/event";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const targetRoutes = ref([]);
const appStore = useAppStore();
const showDropdown = ref(false);
const authStore = useAuthStore();

// Custom global event
onMounted(() => {
  Event.on(
    EventEnum.GLOBAL_CLICK,
    function () {
      showDropdown.value = false;
    },
    true
  );
});

const onLogout = async () => {
  await authStore.logout();
  router.go();
};

const onRouteClick = (name = route.name, hasChild = false) => {
  if (hasChild) {
    name = route.matched[0].redirect.name;
  }
  appStore.currentNav = navs.find((r) => r.route == name);
  if (!appStore.currentNav) {
    let children = [];
    navs
      .filter((nav) => nav.children)
      .forEach((nav) => {
        children = [...children, ...nav.children];
      });

    appStore.currentNav = children.find((r) => r.route == name);
  }
};

const getIncludeActiveRoutes = (rt) => {
  if (rt.includes_active) {
    rt.includes_active.forEach((iart) => {
      targetRoutes.value.push({
        parent: rt,
        route_name: iart,
      });
    });
  }

  if (rt.children) {
    rt.children.forEach((r) => getIncludeActiveRoutes(r));
  }
};

const getActiveRouteBasedIncludes = (route) => {
  const rt = targetRoutes.value.find((r) => r.route_name == route.name);
  if (rt) appStore.currentNav = rt.parent;
};

navs.forEach((rt) => getIncludeActiveRoutes(rt));

watch(route, (val) => {
  getActiveRouteBasedIncludes(val);
});

// run function upon loading
onRouteClick();
getActiveRouteBasedIncludes(route);
</script>

<style scoped>
.dropdown {
  @apply absolute max-w-[75%] w-fit bg-white right-0 top-15 rounded shadow text-black;
}

.dropdown-item {
  @apply hover:bg-blue-200 px-3 first:rounded-t last:rounded-b text-sm py-1;
}
</style>
