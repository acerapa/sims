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
      <p>Item list</p>
      <MultiSelectTable
        :format="itemFormat"
        v-model="model.items"
        :has-add-new-item="false"
        :row-component="PhysicalInventoryAdjustmentFormRow"
        :header-component="PhysicalInventoryAdjustmentFormHeader"
      />
      <div class="flex justify-end gap-3">
        <button class="btn-danger-outline" @click="onCancelOrBack">
          cancel
        </button>
        <button class="btn">submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import PhysicalInventoryAdjustmentFormHeader from '@/components/Inventory/PhysicalInventory/PhysicalInventoryAdjustmentFormHeader.vue'
import PhysicalInventoryAdjustmentFormRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryAdjustmentFormRow.vue'

import Event from '@/event'
import { DateHelpers } from 'shared'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { EventEnum } from '@/data/event'
import { InventoryConst } from '@/const/route.constants'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'
import { useTableScroll } from '@/use/useTableScroll'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const physicalInventoryStore = usePhysicalInventoryStore()

const { product } = storeToRefs(productStore)

const tableRef = ref(null)
const authUser = ref(null)
const physicalInventory = ref(null)

const itemFormat = {
  name: '',
  item_id: '',
  category: '',
  new_quantity: null,
  current_quantity: null,
  difference_quantity: 0
}

const model = ref({
  adjustment_information: {
    date_started: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
    adjusted_by: ''
  },
  items: []
})

const errors = ref({}) // Temporary

// composables
useTableScroll(tableRef, true)
const { getAuthUser } = useAuth()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * METHODS
 ** ================================================*/
const onCancelOrBack = () => {
  router.back()
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await productStore.getProducts()
  authUser.value = await getAuthUser()

  if (authUser.value) {
    model.value.adjustment_information.adjusted_by = authUser.value.id
  }

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

    if (physicalInventory.value) {
      model.value.items = physicalInventory.value.items.map((item) => {
        productStore.getProduct(item.product_id)
        return {
          item_id: item.id,
          difference_quantity: 0,
          current_quantity: item.physical_quantity,
          name: product.value.product_details.purchase_description,
          category: product.value.categories.map((pc) => pc.name).join(':')
        }
      })
    }
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
