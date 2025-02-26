<template>
  <CustomTable
    title="Sales Order List"
    :data="filteredData"
    :has-pagination="true"
    :row-prop-init="rowPropInit"
    @add-new-record="onAddNewRecord"
    :table-row-component="SalesOrderRow"
  >
    <template #table_header>
      <div class="grid grid-cols-9 gap-3 min-w-[935px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">Type</p>
        <p class="col-span-1 table-header">Total</p>
        <p class="col-span-2 table-header">Date</p>
        <p class="col-span-2 table-header">Purchase Date</p>
        <p class="col-span-1 table-header">Status</p>
      </div>
    </template>
  </CustomTable>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import SalesOrderRow from '../../components/sales/SalesOrderRow.vue'
import { useSalesStore } from '@/stores/sales'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const salesStore = useSalesStore()
const router = useRouter()

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
  return salesStore.salesOrders.filter((salesOrder) => salesOrder)
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: 'sales-order-form'
  })
}

onMounted(async () => {
  await salesStore.getSalesOrders()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
