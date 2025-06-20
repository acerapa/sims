<template>
  <div ref="tableRef">
    <CustomTable
      @add-new-record="onAddNew"
      title="Invoice List"
      :table-row-component="InvoiceRow"
      :data="filteredData"
      v-model:search-text="searchText"
      :row-prop-init="rowEventName"
      :has-check-box="false"
      :has-pagination="true"
      @view="onView"
    >
      <template #table_header>
        <div class="grid gap-3 grid-cols-9 min-w-[985px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" v-if="false" />
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
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import InvoiceRow from '@/components/sales/invoice/InvoiceRow.vue'

import { SalesConst } from '@/const/route.constants'
import { useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/invoice'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Event from '@/event'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'

const invoiceStore = useInvoiceStore()
const { invoices } = storeToRefs(invoiceStore)
const { getCustomers } = useCustomerStore()
const { getEmployees } = useEmployeeStore()

const router = useRouter()

const searchText = ref('')
const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowEventName = 'invoice-row-init-event'
Event.on(rowEventName, (data) => {
  return { invoice: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return invoices.value.filter((invoice) => {
    let { customer, sales_person } = invoice
    if (!customer) {
      customer = invoice.sales_order.customer
    }
    if (!sales_person) {
      sales_person = invoice.sales_order.sales_person
    }

    const searchCondition = `
      ${invoice.id} ${invoice.customer_id} ${invoice.employee_id}
      ${invoice.issue_date} ${invoice.due_date} ${invoice.status} ${invoice.total}
      ${customer.first_name} ${customer.last_name}
      ${sales_person.first_name} ${sales_person.last_name}
    `.toLowerCase()

    return searchText.value
      ? searchCondition.includes(searchText.value.toLowerCase())
      : invoice
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNew = () => {
  router.push({
    name: SalesConst.INVOICE_FORM
  })
}

const onView = (id) => {
  router.push({
    name: SalesConst.INVOICE_FORM,
    query: { id }
  })
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await invoiceStore.getInvoices()
  await getCustomers()
  await getEmployees()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
