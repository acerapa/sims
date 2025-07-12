<template>
	<div class="grid grid-cols-11 gap-3 min-w-[1158px] gen-table-row">
		<p class="col-span-11 text-sm font-bold">
			{{ props.po.supplier.company_name }}
		</p>
		<div
			class="grid grid-cols-11 gap-3 col-span-11"
			v-for="po in props.po.pos"
			:key="po.id"
		>
			<p class="col-span-2"></p>
			<RouterLink
				class="col-span-1 hover:underline"
				:to="{
					name: PurchaseConst.PURCHASE_ORDER_FORM,
					query: { id: po.id }
				}"
			>
				# {{ po.id }}
			</RouterLink>
			<p class="col-span-1 text-sm">
				{{
					new Date(po.received_date).toLocaleString('default', {
						month: 'short',
						day: '2-digit',
						year: 'numeric'
					})
				}}
			</p>
			<p class="col-span-1 text-sm">{{ po.delivery_number }}</p>
			<div
				class="grid grid-cols-11 col-span-11 gap-3"
				v-for="prd in po.products"
				:key="prd.id"
			>
				<p class="col-span-5"></p>
				<p class="col-span-3 text-sm">
					{{ prd.product_details.purchase_description }}
				</p>
				<p class="col-span-1 text-sm text-center">
					{{ prd.PurchaseOrderProducts.quantity }}
				</p>
				<p class="col-span-1 text-sm text-end">
					₱ {{ prd.PurchaseOrderProducts.cost }}
				</p>
				<p class="col-span-1 text-sm text-end">
					₱ {{ prd.PurchaseOrderProducts.amount }}
				</p>
			</div>
		</div>
		<p class="col-span-10 text-sm font-bold">
			{{ props.po.supplier.company_name }} Total
		</p>
		<p class="col-span-1 text-sm font-bold text-end border-t border-black">
			₱ {{ totalPOAmount.toFixed(2) }}
		</p>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { PurchaseConst } from '@/const/route.constants'

const props = defineProps({
	po: {
		type: Object,
		default: () => ({})
	}
})

const totalPOAmount = computed(() => {
	return props.po.pos
		.map((po) => parseFloat(po.amount))
		.reduce((a, b) => a + b, 0)
})
</script>
