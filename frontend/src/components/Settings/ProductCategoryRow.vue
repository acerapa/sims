<template>
  <div class="grid grid-cols-7 gap-3">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.productCategory.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.productCategory.name }}</p>
    <p class="col-span-2 text-sm">
      {{ Helpers.formatDate(props.productCategory.createdAt, "M/D/YYYY") }}
    </p>
    <div class="col-span-1 text-sm">
      <img
        @click.stop="openMenu(props.productCategory.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { Helpers } from "@/helpers";

const props = defineProps({
  productCategory: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["openMenu"]);

const openMenu = (id) => {
  emit("openMenu", id);
};
</script>
