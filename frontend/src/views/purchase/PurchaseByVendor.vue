<template>
	<CustomTable />
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'


import { onMounted } from 'vue'
import { usePurchaseStore } from '@/stores/purchase'
import { EventEnum } from '@/data/event'

import Event from '@/event'

const purchaseStore = usePurchaseStore()

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
