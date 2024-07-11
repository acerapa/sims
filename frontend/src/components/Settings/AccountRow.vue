<template>
  <div class="grid grid-cols-9 gap-3">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.account.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.account.name }}</p>
    <p class="col-span-2 text-sm">{{ props.account.type }}</p>
    <p class="col-span-2 text-sm">
      {{ Helpers.formatDate(props.account.createdAt, "M/D/YYYY") }}
    </p>
    <p class="col-span-1 text-sm">
      <img
        src="@/assets/icons/vertical-menu.svg"
        alt=""
        class="cursor-pointer menu-btn-trigger"
        @click.stop="openMenu(props.account.id)"
      />
    </p>
  </div>
</template>

<script setup>
import { Helpers } from "@/helpers";
const emit = defineEmits(["openMenu"]);
const props = defineProps({
  account: {
    type: Object,
    default: () => ({}),
  },
});

const openMenu = (id) => {
  emit("openMenu", id);
};
</script>
