<template>
  <DeleteConfirmModal
    v-if="showDeleteModal"
    :href="`transfer/${selectedId}`"
    v-model="showDeleteModal"
  />
  <div>
    <CustomTable
      :data="filteredData"
      :has-pagination="true"
      @open-menu="onSelectRow"
      :row-prop-init="rowPropInit"
      @add-new-record="onAddNewRecord"
      :table-row-component="StrListRow"
      :table-header-component="StrListHeader"
    >
      <RowMenu
        :top="top"
        v-if="showRowMenu"
        @view="onViewRow"
        @delete="onDeleteRow"
      />
    </CustomTable>
  </div>
</template>

<script setup>
import StrListRow from '@/components/stock-transfer/str-list-row.vue'
import StrListHeader from '@/components/stock-transfer/str-list-header.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTransferStore } from '@/stores/transfer'
import { TransferType } from 'shared/enums'
import RowMenu from '@/components/shared/RowMenu.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'

const top = ref(0)
const router = useRouter()
const selectedId = ref(-1)
const showRowMenu = ref(false)
const showDeleteModal = ref(false)
const transferStore = useTransferStore()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false
})

const rowPropInit = 'str-row-prop-init'
Event.on(rowPropInit, function (data) {
  return { str: data }
})
/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return transferStore.strs ? transferStore.strs.filter((str) => true) : 0
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: 'str-form'
  })
}

const onSelectRow = (id) => {
  selectedId.value = id
  top.value = event.target.offsetTop
  showRowMenu.value = true
}

const onViewRow = () => {
  router.push({
    name: 'str-form',
    query: { id: selectedId.value }
  })
}

const onDeleteRow = () => {
  showDeleteModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await transferStore.fetchTransfers()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
