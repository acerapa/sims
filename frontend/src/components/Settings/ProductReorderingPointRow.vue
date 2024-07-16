<template>
  <div class="grid grid-col-6 gap-3">
		<div class="col-span-1 flex gap-3 items-center">
			<input type="checkbox" class="input" />
			<p class="text-sm">{{ props.productReordering.id }}</p>
		</div>
		<p class="col-span-1 text-sm">{{ props.productReordering.point }}</p>
		<p class="col-span-3 text-sm">{{ props.productReordering.products }}</p>
		<p class="col-span-1 text-sm">Actions</p>
	</div>
</template>

<script setup>
const props = defineProps({
  productReordering: {
    type: Object,
    default: () => ({}),
  },
});
</script>
