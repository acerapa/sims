<template>
  <div>
    <CustomTable
      title="RMA list"
      :data="filterData"
      :has-pagination="true"
      :row-prop-init="rowInitProp"
      @add-new-record="onNewRecord"
      v-model:search-text="searchText"
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
import { computed, onMounted, ref } from 'vue'
import { useTransferStore } from '@/stores/transfer'
import Event from '@/event'
import { EventEnum } from '@/data/event'

const searchText = ref('')
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
  return transferStore.rmas.filter((rma) => {
    const searchCondition = `${rma.id} ${rma.supplier.company_name} ${rma.process_by.first_name} ${rma.process_by.last_name} ${rma.when}`

    return searchText.value
      ? searchCondition.toLowerCase().includes(searchText.value.toLowerCase())
      : true
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  router.push({
    name: 'rma-form'
  })
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
  await transferStore.getTransfers()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
