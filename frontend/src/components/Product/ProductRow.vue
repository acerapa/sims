<template>
  <div class="grid grid-cols-10 gap-3 min-w-[907px] relative">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.product.id }}</p>
    </div>
    <p class="col-span-1 text-sm truncate" :title="props.product.name">
      {{ props.product.name }}
    </p>
    <p class="col-span-1 text-sm">{{ props.product.item_code }}</p>
    <p class="col-span-3 text-sm line-clamp-2">{{ props.product.description }}</p>
    <p class="col-span-1 text-sm">{{ props.product.quantityInStock }}</p>
    <p class="col-span-1 text-sm">{{ props.product.added_on }}</p>
    <div class="col-span-1 text-sm">{{ props.product.status }}</div>
    <div class="col-span-1">
      <img
        src="@/assets/icons/vertical-menu.svg"
        alt=""
        class="cursor-pointer menu-btn-trigger"
        @click="openMenu(props.product.id)"
      />
    </div>
    <ProductRowMenu
      @delete="emit('delete', props.product.id)"
      @view="emit('view', props.product.id)"
    />
  </div>
</template>

<script setup>
import ProductRowMenu from "@/components/Product/ProductRowMenu.vue";
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["delete", "view", "openMenu"]);

const openMenu = () => {
  emit("openMenu", props.product.id);
};
</script>
