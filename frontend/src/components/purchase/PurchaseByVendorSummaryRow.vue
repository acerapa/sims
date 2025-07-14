<template>
	<div class="grid grid-cols-2 gap-3 gen-table-row">
		<p class="text-sm">{{ props.po.supplier.company_name }}</p>
		<p class="text-sm text-end">₱ {{ totalPurchase.toFixed(1) }}</p>
	</div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
	po: {
		type: Object,
		default: () => ({})
	}
})

const totalPurchase = computed(() => {
	return props.po.pos
		.map((p) => parseFloat(p.amount))
		.reduce((a, b) => a + b, 0)
})
</script>
