<template>
  <BranchModal v-model="showModal" v-if="showModal" :selected-id="selectedId" />
  <div class="flex flex-col gap-4">
    <CustomTable
      class="relative"
      title="Branch List"
      :data="filterData"
      :has-pagination="true"
      :row-prop-init="rowPropInit"
      v-model:search-text="searchText"
      :table-row-component="BranchRow"
      @view="onView"
      @add-new-record="onNewRecord()"
    >
      <template #table_header>
        <div class="grid grid-cols-9 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">Name</p>
          <p class="col-span-3 table-header">Address</p>
          <p class="col-span-2 table-header">Manager</p>
          <p class="col-span-1 table-header">Status</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import BranchModal from '@/components/Settings/BranchModal.vue'
import BranchRow from '@/components/Settings/BranchRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useSettingsStore } from '@/stores/settings'
import { computed, onMounted, ref } from 'vue'

const selectedId = ref(0)
const searchText = ref('')
const showModal = ref(false)
const showRowMenu = ref(false)
const settingsStore = useSettingsStore()

/** ================================================
 * COMPUTED
 ** ================================================*/
const filterData = computed(() => {
  return settingsStore.branches.filter((branch) => {
    const searchCondition = `${branch.id} ${branch.name} ${branch.status} ${branch.address.address1} ${branch.address.address2} ${branch.address.city} ${branch.address.postal} ${branch.manager.first_name} ${branch.manager.last_name}`

    return searchText.value
      ? searchCondition.toLowerCase().includes(searchText.value.toLowerCase())
      : branch
  })
})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

Event.on(
  EventEnum.GLOBAL_CLICK,
  function () {
    showRowMenu.value = false
  },
  true
)

const rowPropInit = 'branch-init-rows'
Event.on(rowPropInit, function (data) {
  return { branch: data }
})

/** ================================================
 * METHODS
 ** ================================================*/
const onView = (id) => {
  selectedId.value = id
  showModal.value = true
}

const onNewRecord = () => {
  selectedId.value = 0
  showModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await settingsStore.getBranches()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
