<template>
  <div class="flex flex-col gap-6">
    <button class="btn w-fit" @click="onStartPhysicalInventory">
      Start Physical Inventory
    </button>
    <CustomTable
      :has-add-btn="false"
      :data="filteredData"
      :has-pagination="true"
      :row-prop-init="eventRowInit"
      :table-row-component="PhysicalInventoryRow"
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
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'
import { useProductStore } from '@/stores/product'
import { PhysicalInventoryStatus } from 'shared/enums'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { getAuthUser } = useAuth()
const productStore = useProductStore()
const physicalInventoryStore = usePhysicalInventoryStore()

const authUser = ref(null)

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
  const model = {
    physical_inventory: {
      date_started: new Date(),
      status: PhysicalInventoryStatus.DRAFT,
      inventory_incharge: authUser.value?.id,
      branch_manager: authUser.value?.id, // temporary for now (supposedly need to set branch manager in the system)
      date_ended: null
    },
    items: []
  }
  // fetch all products
  await productStore.fetchAllProducts()

  model.items = productStore.products.map((product) => {
    return {
      quantity: product.quantity_in_stock,
      physical_quantity: 0,
      product_id: product.id,
      physical_inventory_id: 0
    }
  })

  const res = await physicalInventoryStore.register(model)

  if (res.status == 200) {
    router.push({
      name: 'physical-inventory-details',
      params: {
        id: res.data.physical_inventory.id
      }
    })
  }
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
