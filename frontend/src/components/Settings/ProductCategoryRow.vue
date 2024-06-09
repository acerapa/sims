<template>
  <div class="grid grid-cols-7 gap-3 relative" @click="clickOutSide">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.productCategory.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.productCategory.name }}</p>
    <p class="col-span-2 text-sm">
      {{ new Date(props.productCategory.createdAt).toLocaleDateString() }}
    </p>
    <div class="col-span-1 text-sm">
      <img
        @click="openMenu(props.productCategory.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
    <ProductCategoryRowMenu
      v-if="showActionMenu"
      @delete="emit('delete', props.productCategory.id); action = false"
      @view="emit('view', props.productCategory.id); action = false"
    />
  </div>
</template>

<script setup>
import ProductCategoryRowMenu from "@/components/Settings/ProductCategoryRowMenu.vue";
import { computed, ref } from "vue";

const props = defineProps({
  productCategory: {
    type: Object,
    default: () => ({}),
  },
  currentOpenMenu: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["openMenu", "delete", "view"]);

const openMenu = (id) => {
  emit("openMenu", id);
};

const action = ref(false);

const showActionMenu = computed(
  () => action.value && props.currentOpenMenu == props.productCategory.id
);

const clickOutSide = (event) => {
  if (Array.from(event.target.classList).includes("menu-btn-trigger")) {
    action.value = !action.value; // toggle effect
  } else {
    action.value = false;
  }
};
</script>
