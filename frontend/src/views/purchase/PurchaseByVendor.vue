<template>
	<div ref="tableRef">
		<CustomTable
			:data="filteredData"
			:row-prop-init="rowPropInit"
			:table-header-component="PurchaseByVendorHeader"
			:table-row-component="PurchaseByVendorRow"
		/>
	</div>
</template>

<script setup>
import PurchaseByVendorHeader from '@/components/purchase/PurchaseByVendorHeader.vue'
import PurchaseByVendorRow from '@/components/purchase/PurchaseByVendorRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'

import { onMounted, ref, computed } from 'vue'
import { usePurchaseStore } from '@/stores/purchase'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'

import Event from '@/event'

const purchaseStore = usePurchaseStore()

const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)
/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'purchase-by-vendor-row-prop-init'
Event.on(rowPropInit, (data) => {
	return { po: data }
})

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
	return purchaseStore.purchaseByVendor
})

onMounted(async () => {
	// call api
	await purchaseStore.fetchPurchaseByVendor()

	console.log(filteredData.value)
	Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

</script>
