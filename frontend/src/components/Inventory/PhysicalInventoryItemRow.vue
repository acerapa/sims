<template>
  <div class="grid grid-cols-9 gap-3 min-w-[760px]">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.item.id }}</p>
    </div>
    <p class="col-span-1 text-sm">{{ props.item.product_id }}</p>
    <p class="col-span-2 text-sm">Item Desc</p>
    <p class="col-span-1 text-sm">Qty</p>
    <p class="col-span-1 text-sm">Phys Count</p>
    <p class="col-span-2 text-sm">Remarks</p>
    <p class="col-span-1 text-sm">Actions</p>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
</script>
