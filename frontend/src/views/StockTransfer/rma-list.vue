<template>
  <div>
    <CustomTable
      title="RMA list"
      :data="filterData"
      :has-pagination="true"
      :row-prop-init="rowInitProp"
      @add-new-record="onNewRecord"
      :table-row-component="RmaListRow"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-9 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Supplier</p>
          <p class="col-span-3 table-header">Prepared By</p>
          <p class="col-span-2 table-header">When</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import RmaListRow from '@/components/stock-transfer/rma-list-row.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useTransferStore } from '@/stores/transfer'
import Event from '@/event'
import { EventEnum } from '@/data/event'

const router = useRouter()
const transferStore = useTransferStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowInitProp = 'rma-row-init-prop'
Event.on(rowInitProp, (data) => {
  return {
    rma: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filterData = computed(() => {
  return transferStore.rmas
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  router.push({
    name: 'rma-form'
  })
}

const onAfterDelete = async () => {
  await transferStore.fetchTransfers()
}

const onView = (id) => {
  router.push({
    name: 'rma-form',
    query: {
      id: id
    }
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.fetchTransfers()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
