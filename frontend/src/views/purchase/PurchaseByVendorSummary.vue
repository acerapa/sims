<template>
	<div ref="tableRef" class="flex flex-col gap-4">
		<CustomTable
			:data="filteredData"
			:row-prop-init="rowPropInit"
			v-model:searchText="searchText"
			:table-row-component="PurchaseByVendorSummaryRow"
			:table-header-component="PurchaseByVendorSummaryHeader"
		>
			<template #table_header>
				<div class="grid grid-cols-2 gap-3">
					<p class="cols"></p>
				</div>
			</template>
			<template #tools>
				<div class="flex gap-6">
					<CustomInput
						type="date"
						label="From:"
						name="date-from"
						:has-label="true"
						v-model="dateFilter.from"
						class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
					/>
					<CustomInput
						type="date"
						label="To:"
						name="date-to"
						:has-label="true"
						v-model="dateFilter.to"
						class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
					/>
				</div>
			</template>
		</CustomTable>

		<div class="cont !grid grid-cols-2 gap-3">
			<p class="font-bold">Total:</p>
			<p class="text-end">₱ {{ parseFloat(overAllTotal).toFixed(2) }}</p>
		</div>
	</div>
</template>

<script setup>
import Event from '@/event'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import PurchaseByVendorSummaryRow from '@/components/purchase/PurchaseByVendorSummaryRow.vue'
import PurchaseByVendorSummaryHeader from '@/components/purchase/PurchaseByVendorSummaryHeader.vue'

import { onMounted, ref, computed } from 'vue'
import { usePurchaseStore } from '@/stores/purchase'
import { DateHelpers } from 'shared'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'

const purchaseStore = usePurchaseStore()

const tableRef = ref()
const searchText = ref('')
const dateFilter = ref({
	from: '',
	to: ''
})

// composables
useTableScroll(tableRef, false)
/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'purchase-by-vendor-summary-row-prop-init'
Event.on(rowPropInit, (data) => {
	return { po: data }
})

Event.emit(EventEnum.IS_PAGE_LOADING, true)

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

const overAllTotal = computed(() => {
	return filteredData.value
		.map((p) =>
			p.pos.map((po) => parseFloat(po.amount)).reduce((a, b) => a + b, 0)
		)
		.reduce((a, b) => a + b, 0)
})

/** ================================================
 * METHODS
 ** ================================================*/
const setFilterDate = () => {
	const current = new Date()
	// Get the previous date and it's first date
	dateFilter.value.to = DateHelpers.formatDate(current, 'YYYY-MM-DD')

	const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1)
	dateFilter.value.from = DateHelpers.formatDate(previous, 'YYYY-MM-DD')
}
setFilterDate()

onMounted(async () => {
	await purchaseStore.fetchPurchaseByVendor(
		dateFilter.value.from,
		dateFilter.value.to
	)

	Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
