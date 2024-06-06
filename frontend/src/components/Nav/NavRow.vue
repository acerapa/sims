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
        :to="{ name: child.route }"
        active-class="bg-dark-blue font-bold"
        @click="emitRouteClick(child.route, child.children)"
      >
        <img :src="child.icon" alt="" />
        {{ child.text }}
      </RouterLink>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  nav: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["routeClick"]);
const route = useRoute();

const isOpenChildNav = () => {
  const parent = route.matched.find(
    (rt) => rt.children.length && props.nav.route == rt.name
  );
  return parent;
};

const emitRouteClick = (nav, hasChild) => {
  setTimeout(() => {
    emit("routeClick", nav, hasChild);
  }, 200);
};
</script>
