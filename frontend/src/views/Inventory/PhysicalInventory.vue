<template>
  <div class="flex flex-col gap-6" ref="tableRef">
    <CustomTable
      :has-add-btn="true"
      :data="filteredData"
      :has-pagination="true"
      :row-prop-init="eventRowInit"
      :table-row-component="PhysicalInventoryRow"
      :btn-custom-text="'New Physical Inventory'"
      @add-new-record="onStartPhysicalInventory"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-4 gap-3 min-w-[935px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-1 table-header">Date Started</p>
          <p class="col-span-1 table-header">Status</p>
          <p class="col-span-1 table-header">Date Ended</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import PhysicalInventoryRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryRow.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { useAuth } from '@/composables/useAuth'
import { InventoryConst } from '@/const/route.constants'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'
import { useTableScroll } from '@/use/useTableScroll'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { getAuthUser } = useAuth()
const physicalInventoryStore = usePhysicalInventoryStore()

const authUser = ref(null)
const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const eventRowInit = 'event-initialize-row'
Event.on(eventRowInit, function (data) {
  return { inventory: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return physicalInventoryStore.physicalInventories
})

/** ================================================
 * METHODS
 ** ================================================*/
const onStartPhysicalInventory = async () => {
  router.push({
    name: InventoryConst.PHYSICAL_INVENTORY_FORM
  })
}

const onView = (id) => {
  router.push({
    name: 'physical-inventory-details',
    params: { id }
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  authUser.value = await getAuthUser()
  await physicalInventoryStore.fetchAllPhysicalInventories()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
