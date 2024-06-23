<template>
  <div class="grid grid-cols-9 gap-3 items-center">
    <div class="col-span-2 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ order.product.item_code }}</p>
    </div>
		<p class="col-span-3 text-sm">{{ order.product.purchase_description }}</p>
		<p class="col-span-1 text-sm">{{ order.quantity }}</p>
		<p class="col-span-1 text-sm">{{ order.product.purchase_price }}</p>
		<p class="col-span-1 text-sm">{{ order.amount }}</p>
		<p class="col-span-1 text-sm pl-3">
			<img src="@/assets/icons/remove.svg" class="cursor-pointer w-5 h-5" alt="remove">
		</p>
  </div>
</template>

<script setup>
const props = defineProps({
	order: {
		type: Object,
		default: () => ({})
	}
});
</script>
