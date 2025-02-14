<template>
  <CustomTable
    @view="onView"
    :has-add-btn="true"
    :data="filteredData"
    :has-pagination="true"
    :row-prop-init="rowPropInit"
    v-model:search-text="searchText"
    @add-new-record="onAddNewRecord"
    :table-row-component="IbrrListRow"
  >
    <template #table_header>
      <div class="grid grid-cols-9 gap-3">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-1 table-header">STR #</p>
        <p class="col-span-2 table-header">From</p>
        <p class="col-span-1 table-header">Manager</p>
        <p class="col-span-1 table-header">Process By</p>
        <p class="col-span-2 table-header">When</p>
        <p class="col-span-1 table-header">Status</p>
      </div>
    </template>
  </CustomTable>
</template>

<script setup>
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { computed, onMounted, ref } from 'vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { useRouter } from 'vue-router'
import { useTransferStore } from '@/stores/transfer'
import IbrrListRow from '@/components/stock-transfer/ibrr-list-row.vue'
import { TransferConst } from '@/const/route.constants'

const router = useRouter()
const searchText = ref('')
const transferStore = useTransferStore()
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'ibrr-row-prop-init'
Event.on(rowPropInit, (data) => {
  return {
    ibrr: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return transferStore.ibrrs.filter((transfer) => {
    const searchCondition = `${transfer.id} ${transfer.sender.manager.first_name} ${transfer.sender.manager.last_name} ${transfer.process_by.first_name} ${transfer.process_by.last_name}`

    return searchText.value
      ? searchCondition.toLowerCase().includes(searchText.value.toLowerCase())
      : true
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: TransferConst.IBRR_FORM
  })
}

const onView = (id) => {
  router.push({
    name: TransferConst.IBRR_FORM,
    query: { id: id }
  })
}
/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.getTransfers()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
