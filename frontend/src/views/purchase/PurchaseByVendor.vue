<template>
	<div ref="tableRef">
		<CustomTable
			:data="[]"
			:table-header-component="PurchaseByVendorHeader"
			:table-row-component="PurchaseByVendorRow"
		/>
	</div>
</template>

<script setup>
import PurchaseByVendorHeader from '@/components/purchase/PurchaseByVendorHeader.vue'
import PurchaseByVendorRow from '@/components/purchase/PurchaseByVendorRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'

import { onMounted, ref } from 'vue'
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
Event.emit(EventEnum.IS_PAGE_LOADING, true)


onMounted(async () => {
	// call api
	await purchaseStore.fetchPurchaseByVendor()

	Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

</script>
