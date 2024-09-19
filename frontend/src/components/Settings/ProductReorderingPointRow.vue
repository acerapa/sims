<template>
  <div class="grid grid-cols-6 gap-3 items-start min-w-[430px]">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.productReordering.id }}</p>
    </div>
    <p class="col-span-1 text-sm">{{ props.productReordering.point }}</p>
    <div class="col-span-3 text-sm flex flex-wrap gap-3">
      <p
        class="text-xs bg-blue-200 px-2 py-1 rounded"
        v-for="(product, ndx) in props.productReordering.products"
        :key="ndx"
      >
        {{ product.name }}
      </p>
    </div>
    <div class="col-span-1 text-sm">
      <img
        @click.stop="openMenu(props.productReordering.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  productReordering: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["openMenu"]);

const openMenu = (id) => {
  emit("openMenu", id);
};
</script>
