<template>
  <div class="w-64 fixed h-screen bg-regular-blue text-white">
    <!-- User Profile -->
    <div class="bg-lighter-blue flex p-3 items-center h-15">
      <div class="flex-1">
        <p>Administrator</p>
        <p class="text-xs text-[#ADB3B9]">admin</p>
      </div>
      <img
        class="w-12 h-12 rounded-full"
        src="../../assets/images/profile-sample.png"
        alt="profile"
      />
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
import { useRoute } from "vue-router";
import NavRow from "./NavRow.vue";
import navs from "@/data/nav";
import { onMounted, ref, watch } from "vue";

const route = useRoute();
const appStore = useAppStore();
const targetRoutes = ref([]);

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
    rt.includes_active.forEach(iart => {
      targetRoutes.value.push({
        parent: rt,
        route_name: iart
      });
    });
  }

  if (rt.children) {
    rt.children.forEach((r) => getIncludeActiveRoutes(r));
  }
};

const getActiveRouteBasedIncludes = (route) => {
  const rt = targetRoutes.value.find(r => r.route_name == route.name);
  if (rt) appStore.currentNav = rt.parent;
}

navs.forEach((rt) => getIncludeActiveRoutes(rt));

watch(route, (val) => {
  getActiveRouteBasedIncludes(val);
});


// run function upon loading
onRouteClick();
getActiveRouteBasedIncludes(route);
</script>
