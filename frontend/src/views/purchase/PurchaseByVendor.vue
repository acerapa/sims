<template>
	<div ref="tableRef">
		<CustomTable
			:has-tools="true"
			:data="filteredData"
			:row-prop-init="rowPropInit"
			v-model:searchText="searchText"
			:table-header-component="PurchaseByVendorHeader"
			:table-row-component="PurchaseByVendorRow"
		>
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
	</div>
</template>

<script setup>
import PurchaseByVendorHeader from '@/components/purchase/PurchaseByVendorHeader.vue'
import PurchaseByVendorRow from '@/components/purchase/PurchaseByVendorRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import CustomInput from '@/components/shared/CustomInput.vue'

import { onMounted, ref, computed, watch } from 'vue'
import { usePurchaseStore } from '@/stores/purchase'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'
import { DateHelpers } from 'shared'

import Event from '@/event'

const purchaseStore = usePurchaseStore()

const searchText = ref('')
const tableRef = ref(null)

const dateFilter = ref({
	from: '',
	to: ''
})

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
	return purchaseStore.purchaseByVendor.filter((pos) =>
		searchText.value
			? pos.supplier.company_name
					.toLowerCase()
					.includes(searchText.value.toLowerCase())
			: true
	)
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
	// call api
	await purchaseStore.fetchPurchaseByVendor(
		dateFilter.value.from,
		dateFilter.value.to
	)
	Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
	() => ({ from: dateFilter.value.from, to: dateFilter.value.to }),
	async (newVal, oldVal) => {
		if (newVal.from != oldVal.from || newVal.to != oldVal.to) {
			// call api to handle date filter changes
			await purchaseStore.fetchPurchaseByVendor(
				dateFilter.value.from,
				dateFilter.value.to
			)
		}
	},
	{ deep: true }
)
</script>
