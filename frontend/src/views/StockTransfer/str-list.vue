<template>
  <div>
    <CustomTable
      @view="onView"
      :data="filteredData"
      :has-pagination="true"
      :row-prop-init="rowPropInit"
      v-model:search-text="searchText"
      @add-new-record="onAddNewRecord"
      :table-row-component="StrListRow"
    >
      <template #table_header>
        <div class="grid grid-cols-7 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">From</p>
          <p class="col-span-1 table-header">Manager</p>
          <p class="col-span-1 table-header">Process By</p>
          <p class="col-span-2 table-header">When</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import StrListRow from '@/components/stock-transfer/str-list-row.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTransferStore } from '@/stores/transfer'
import { DateHelpers } from 'shared/helpers'

const searchText = ref()
const router = useRouter()
const transferStore = useTransferStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'str-row-prop-init'
Event.on(rowPropInit, function (data) {
  return { str: data }
})
/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return transferStore.strs
    ? transferStore.strs.filter((str) => {
        const searchCondition = `${str.receiver.name} ${str.receiver.manager.first_name} ${str.receiver.manager.last_name} ${str.process_by.first_name} ${str.process_by.last_name} ${DateHelpers.formatDate(str.when, 'MM/DD/YYYY HH:II a')}`
        return searchText.value
          ? searchCondition
              .toLowerCase()
              .includes(searchText.value.toLowerCase())
          : true
      })
    : 0
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: 'str-form'
  })
}

const onView = (id) => {
  router.push({
    name: 'str-form',
    query: { id }
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
