<template>
  <div ref="tableRef">
    <CustomTable
      @view="onView"
      :data="filteredData"
      :has-pagination="true"
      :has-check-box="false"
      :row-prop-init="rowPropInit"
      v-model:search-text="searchText"
      @add-new-record="onAddNewRecord"
      :table-row-component="StrListRow"
    >
      <template #table_header>
        <div class="grid grid-cols-8 gap-3 min-w-[1048px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" v-if="false" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">From</p>
          <p class="col-span-1 table-header">Manager</p>
          <p class="col-span-1 table-header">Process By</p>
          <p class="col-span-2 table-header">When</p>
          <p class="col-span-1 table-header">Status</p>
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
import { TransferConst } from '@/const/route.constants'
import { useTableScroll } from '@/use/useTableScroll'

const searchText = ref()
const router = useRouter()
const tableRef = ref(null)
const transferStore = useTransferStore()

// composables
useTableScroll(tableRef, false)

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
    name: TransferConst.STR_FORM
  })
}

const onView = (id) => {
  router.push({
    name: TransferConst.STR_FORM,
    query: { id }
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
