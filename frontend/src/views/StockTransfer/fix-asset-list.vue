<template>
  <div>
    <CustomTable
      :data="filteredData"
      title="Fix Asset List"
      :has-pagination="true"
      :row-prop-init="rowPropInit"
      @add-new-record="onAddNewRecord"
      :table-row-component="FixAssetRow"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-6 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-1 table-header">PO no.</p>
          <p class="col-span-2 table-header">Prepared By</p>
          <p class="col-span-2 table-header">When</p>
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
import { onMounted, computed } from 'vue'
import Event from '@/event'
import { EventEnum } from '../../data/event/index'

const router = useRouter()
const transferStore = useTransferStore()

Event.emit(EventEnum.IS_PAGE_LOADING)

const rowPropInit = 'row-init-props-fix'
Event.on(rowPropInit, (data) => {
  return {
    fixAsset: data
  }
})

const filteredData = computed(() => {
  return transferStore.fix.filter((t) => t)
})

const onAddNewRecord = () => {
  router.push({
    name: 'fix-asset-form'
  })
}

const onView = (id) => {
  router.push({
    name: 'fix-asset-form',
    query: {
      id
    }
  })
}

onMounted(async () => {
  await transferStore.getTransfers()
})
</script>
