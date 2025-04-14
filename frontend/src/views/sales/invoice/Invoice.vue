<template>
  <CustomTable
    @add-new-record="onAddNew"
    title="Invoice List"
    :table-row-component="InvoiceRow"
    class="w-[calc(100vw_-_328px)]"
    :data="filteredData"
    :row-prop-init="rowEventName"
    :has-pagination="true"
  >
    <template #table_header>
      <div class="grid gap-3 grid-cols-9 min-w-[985px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">Customer</p>
        <p class="col-span-2 table-header">Prep By</p>
        <p class="col-span-1 table-header">Issue Date</p>
        <p class="col-span-1 table-header">Due Date</p>
        <p class="col-span-1 table-header">Status</p>
        <p class="col-span-1 table-header">Total</p>
      </div>
    </template>
  </CustomTable>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import InvoiceRow from '@/components/sales/invoice/InvoiceRow.vue'

import { SalesConst } from '@/const/route.constants'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoice'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import Event from '@/event'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'

const invoiceStore = useInvoiceStore()
const { invoices } = storeToRefs(invoiceStore)
const { getCustomers } = useCustomerStore()
const { getEmployees } = useEmployeeStore()

const router = useRouter()

/** ================================================
 * EVENTS
 ** ================================================*/
const rowEventName = 'invoice-row-init-event'
Event.on(rowEventName, (data) => {
  return { invoice: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return invoices.value
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNew = () => {
  router.push({
    name: SalesConst.INVOICE_FORM
  })
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await invoiceStore.fetchInvoices()
  await getCustomers()
  await getEmployees()
})
</script>
