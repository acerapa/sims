<template>
  <div ref="tableRef">
    <CustomTable
      :data="filteredData"
      :has-pagination="true"
      :has-check-box="false"
      title="Sales Order List"
      :row-prop-init="rowPropInit"
      @add-new-record="onAddNewRecord"
      v-model:search-text="searchText"
      :table-row-component="SalesOrderRow"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-10 gap-3 min-w-[935px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" v-if="false" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-1 table-header">Type</p>
          <p class="col-span-2 table-header">Customer</p>
          <p class="col-span-2 table-header">Sales Person</p>
          <p class="col-span-1 table-header">Purch Date</p>
          <p class="col-span-1 table-header">Pay Mode</p>
          <p class="col-span-1 table-header">Total</p>
          <p class="col-span-1 table-header">Status</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import SalesOrderRow from '../../components/sales/SalesOrderRow.vue'
import { useSalesStore } from '@/stores/sales'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SalesConst } from '@/const/route.constants'
import { useTableScroll } from '@/use/useTableScroll'

const router = useRouter()
const salesStore = useSalesStore()

const tableRef = ref(null)
const searchText = ref('')

// composables
useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'sales-order-row-prop-init'
Event.on(rowPropInit, (data) => {
  return { order: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return salesStore.salesOrders
    .filter((salesOrder) => salesOrder)
    .filter((salesOrder) => {
      const searchCondition =
        `${salesOrder.type} ${parseFloat(salesOrder.total).toFixed(2)}  ${salesOrder.status} ${salesOrder.purchase_date} ${salesOrder.bill_due}`.toLowerCase()
      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : true
    })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: 'sales-order-form'
  })
}

const onView = (id) => {
  router.push({
    name: SalesConst.SALES_ORDER_FORM,
    query: { id }
  })
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await salesStore.getSalesOrders()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
