<template>
  <div>
    <CustomTable
      :data="filteredData"
      title="Fix Asset List"
      :has-pagination="true"
      :row-prop-init="rowPropInit"
      class="w-[calc(100vw_-_328px)]"
      @add-new-record="onAddNewRecord"
      v-model:search-text="searchText"
      :table-row-component="FixAssetRow"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-7 gap-3 min-w-[740px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-1 table-header">PO no.</p>
          <p class="col-span-2 table-header">Prepared By</p>
          <p class="col-span-2 table-header">When</p>
          <p class="col-span-1 table-header">Status</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CustomTable from '@/components/shared/CustomTable.vue'
import FixAssetRow from '@/components/stock-transfer/fix-asset-row.vue'
import { useTransferStore } from '@/stores/transfer'
import { onMounted, computed, ref } from 'vue'
import Event from '@/event'
import { EventEnum } from '../../data/event/index'
import { DateHelpers } from 'shared/helpers'
import { TransferConst } from '@/const/route.constants'

const router = useRouter()
const searchText = ref('')
const transferStore = useTransferStore()

Event.emit(EventEnum.IS_PAGE_LOADING)

const rowPropInit = 'row-init-props-fix'
Event.on(rowPropInit, (data) => {
  return {
    fixAsset: data
  }
})

const filteredData = computed(() => {
  return transferStore.fix.filter((t) => {
    const searchCondition = `${t.id} ${t.po_no} ${t.process_by.first_name} ${t.process_by.last_name} ${DateHelpers.formatDate(t.when, 'YYYY/MM/DD')}`

    return searchText.value
      ? searchCondition.toLowerCase().includes(searchText.value.toLowerCase())
      : true
  })
})

const onAddNewRecord = () => {
  router.push({
    name: TransferConst.FIX_ASSET_FORM
  })
}

const onView = (id) => {
  router.push({
    name: TransferConst.FIX_ASSET_FORM,
    query: {
      id
    }
  })
}

onMounted(async () => {
  await transferStore.getTransfers()
})
</script>
