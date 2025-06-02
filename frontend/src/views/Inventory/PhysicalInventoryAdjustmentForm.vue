<template>
  <div class="flex flex-col gap-4">
    <div class="cont flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Adjustment Form</h1>
        <RouterLink
          v-if="physicalInventory"
          :to="{
            name: InventoryConst.PHYSICAL_INVENTORY_FORM,
            query: {
              id: physicalInventory.id
            }
          }"
        >
          For Physical Inventory #{{ physicalInventory.id }}
        </RouterLink>
      </div>
      <CustomInput
        type="date"
        :has-label="true"
        name="date_started"
        label="Date Started:"
        :error-has-text="true"
        :disabled="true"
        v-model="model.adjustment_information.date_started"
        :error="errors.adjustment_information?.date_started"
        class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
      />
    </div>
    <div class="cont flex flex-col gap-4" ref="tableRef">
      <p>Product List</p>
      <MultiSelectTable
        :header-component="PhysicalInventoryAdjustmentFormHeader"
      />
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import PhysicalInventoryAdjustmentFormHeader from '@/components/Inventory/PhysicalInventory/PhysicalInventoryAdjustmentFormHeader.vue'

import Event from '@/event'
import { DateHelpers } from 'shared'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { EventEnum } from '@/data/event'
import { InventoryConst } from '@/const/route.constants'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'

const route = useRoute()
const router = useRouter()

const physicalInventoryStore = usePhysicalInventoryStore()

const physicalInventory = ref(null)

const itemFormat = {
  name: '',
  item_id: '',
  category: '',
  new_quantity: 0,
  current_quantity: 0,
  difference_quantity: 0
}

const model = ref({
  adjustment_information: {
    date_started: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD')
  }
})

const errors = ref({}) // Temporary

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (!route.params.physical_inventory_id) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: 'error',
      message: 'Physical Inventory ID is required.'
    })
    router.back()
  } else {
    physicalInventory.value = await physicalInventoryStore.getPhysicalInventory(
      route.params.physical_inventory_id
    )
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
