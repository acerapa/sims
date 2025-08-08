<template>
  <div ref="tableRef">
    <code>Important: Balance column still need to clarify with client</code>
    <CustomTable
      :data="filteredData"
      :has-add-btn="false"
      :row-prop-init="rowPropInit"
      v-model:searchText="searchText"
      :table-row-component="SalesByCustomerDetailedRow"
    >
      <template #table_header>
        <div class="grid grid-cols-12 gap-3">
          <p class="col-span-2 table-header">Customer</p>
          <p class="col-span-1 table-header"># Invoice</p>
          <p class="col-span-2 table-header">Inv. Date</p>
          <p class="col-span-4 table-header">Item Description</p>
          <p class="col-span-1 table-header text-center">Quantity</p>
          <p class="col-span-1 table-header text-end">Sale price</p>
          <p class="col-span-1 table-header text-end">Total</p>
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
      <template #buttons>
        <button class="btn flex gap-3 items-center" @click="onPrint">
          <img class="invert w-5" :src="Printer" />
          <p>Print</p>
        </button>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import SalesByCustomerDetailedRow from '@/components/sales/reports/SalesByCustomerDetailedRow.vue'

// import icon
import Printer from '@/assets/icons/printer.png'
import { computed, onMounted, ref, watch } from 'vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'
import { useInvoiceStore } from '@/stores/invoice'
import { storeToRefs } from 'pinia'
import { DateHelpers } from 'shared'
import { ReportConst } from '@/const/route.constants'
import { useRouter } from 'vue-router'

const router = useRouter()
const invoiceStore = useInvoiceStore()
const { invoicesByCustomer } = storeToRefs(invoiceStore)

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
const rowPropInit = 'sales-by-customer-detailed-row-prop-init'
Event.on(rowPropInit, (data) => {
  return {
    customer: data
  }
})

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return invoicesByCustomer.value.filter((customer) => {
    const searchCondition =
      `${customer.first_name} ${customer.last_name}`.toLowerCase()
    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : true
  })
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

const onPrint = () => {
  router.push({
    name: ReportConst.PRINT_SALES_BY_CUSTOMER_DETAILED,
    query: {
      search_text: searchText.value,
      ...dateFilter.value
    }
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  // call api
  setFilterDate()
  await invoiceStore.fetchInvoiceByCustomer(
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
      await invoiceStore.fetchInvoiceByCustomer(
        dateFilter.value.from,
        dateFilter.value.to
      )
    }
  },
  { deep: true }
)
</script>
