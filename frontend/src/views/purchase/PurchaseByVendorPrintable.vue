<template>
	<div class="bg-white py-8 print:py-0">
		<PrintableHeader
			name="Purchase by Vendor Detailed Report"
		/>
		<div class="flex gap-3 flex-col">
			<!-- Header -->
			<!-- Body -->
		</div>
	</div>
</template>

<script setup>
import PrintableHeader from '@/components/shared/PrintableHeader.vue'

import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePurchaseStore } from '@/stores/purchase'

const route = useRoute()
const purchaseStore = usePurchaseStore()

const purchases = ref([])

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
	return purchaseStore.purchaseByVendor.filter((pos) =>
		searchText.value
			? pos.supplier.company_name
					.toLowerCase()
					.includes(searchText.value.toLowerCase())
			: true
	)
})

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
	// call api to get detailed vendor purchase report
	purchases.value = purchaseStore.fetchPurchaseByVendor(route.query.from, route.query.to)
})
</script>
