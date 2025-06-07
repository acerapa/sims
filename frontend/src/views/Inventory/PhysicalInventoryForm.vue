<template>
  <div class="flex flex-col gap-4">
    <div class="cont flex flex-col gap-4 !pb-6">
      <div class="flex justify-between items-center !py-2 !pb-3">
        <div class="flex gap-3 w-fit items-center">
          <h1 class="text-2xl font-bold">
            Physical Inventory Form
            {{ isViewOrEdit ? `#${physicalInventory?.id}` : '' }}
          </h1>
          <BadgeComponent
            v-if="isViewOrEdit"
            :custom-class="
              PhysicalInventoryStatusMap[model.physical_inventory.status].class
            "
            :text="
              PhysicalInventoryStatusMap[model.physical_inventory.status].text
            "
          />
        </div>
        <CustomInput
          type="date"
          :disabled="true"
          :has-label="true"
          name="date_started"
          label="Date Started:"
          :error-has-text="true"
          v-model="model.physical_inventory.date_started"
          :error="errors.physical_inventory?.date_started"
          class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
        />
      </div>
      <hr />
      <div class="flex flex-col gap-4">
        <p class="text-lg font-normal mb-1">Physical Inventory Information</p>
        <div class="flex gap-5">
          <CustomInput
            type="select"
            class="flex-1"
            :has-label="true"
            :can-search="true"
            name="branch_manager"
            label="Branch Manager"
            :error-has-text="true"
            :options="managerOptions"
            placeholder="Select Manager"
            v-model="model.physical_inventory.branch_manager"
            :error="errors.physical_inventory?.branch_manager"
          />
          <CustomInput
            type="select"
            class="flex-1"
            :has-label="true"
            :can-search="true"
            :error-has-text="true"
            label="Inventory In-Charge"
            name="inventory_incharge_id"
            :options="inventoryInchargeOptions"
            placeholder="Select Inventory In-Charge"
            v-model="model.physical_inventory.inventory_incharge"
            :error="errors.physical_inventory?.inventory_incharge"
          />
        </div>
      </div>
    </div>
    <CustomTable
      :data="adjustmentsMade"
      title-style="!text-base mb-3"
      title="Adjustments Made"
      :has-tools="false"
      :has-filter="false"
      :has-add-btn="false"
      :row-prop-init="rowPropInitAdjustment"
      v-if="isViewOrEdit && isDone"
      :table-row-component="PhysicalInventoryAdjustmentRow"
    >
      <template #table_header>
        <div class="grid grid-cols-6 gap-3">
          <p class="col-span-3 text-sm font-bold">Adjusted by</p>
          <p class="col-span-2 text-sm font-bold">Date Adjusted</p>
          <p class="col-span-1 text-sm font-bold"></p>
        </div>
      </template>
    </CustomTable>
    <div
      class="cont flex flex-col gap-4 mb-10 [&>.main-table>div:nth-child(2)]:max-h-[800px] [&>.main-table>div:nth-child(2)]:overflow-y-auto"
    >
      <p class="text-lg font-normal mb-1">Product List</p>
      <hr />
      <MultiSelectTable
        v-model="model.items"
        :row-prop-init="rowPropInit"
        :has-add-new-item="false"
        :format="PIProducts"
        :is-disabled="isViewOrEdit"
        :row-component="PhysicalInventoryFormRow"
        :header-component="PhysicalInventoryFormHeader"
      />

      <div class="flex justify-end gap-3">
        <button class="btn-danger-outline" @click="onBackOrCancel">
          Cancel
        </button>
        <button
          class="btn-outline"
          v-if="!isViewOrEdit"
          @click="() => onSubmit(true)"
        >
          Save as Draft
        </button>
        <button class="btn-green-outline" v-if="isViewOrEdit && isDraft">
          Submit to done
        </button>
        <button class="btn" @click="() => onSubmit()">
          {{ isViewOrEdit ? 'Update' : 'Submit' }}
        </button>
        <button
          v-if="isViewOrEdit && isDone"
          class="btn-outline"
          @click="onCreateAdjustment"
        >
          Create Adjustments
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
 import PhysicalInventoryAdjustmentRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryAdjustmentRow.vue'
import PhysicalInventoryFormRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryFormRow.vue'
import PhysicalInventoryFormHeader from '@/components/Inventory/PhysicalInventory/PhysicalInventoryFormHeader.vue'

import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useEmployeeStore } from '@/stores/employee'
import { storeToRefs } from 'pinia'
import {
  DateHelpers,
  Joi,
  ObjectHelpers,
  PhysicalInventoryItemSchema,
  PhysicalInventorySchema,
  PhysicalInventoryStatus,
  PhysicalInventoryStatusMap,
  UserType
} from 'shared'
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import { useRoute, useRouter } from 'vue-router'
import { useValidation } from '@/composables/useValidation'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'
import { useAdjustmentsStore } from '@/stores/adjustments'
import { ToastTypes } from '@/data/types'
import { InventoryConst } from '@/const/route.constants'
import BadgeComponent from '@/components/shared/BadgeComponent.vue'

const route = useRoute()
const router = useRouter()

const productStore = useProductStore()
const employeeStore = useEmployeeStore()
const physicalInventoryStore = usePhysicalInventoryStore()
const adjustmentStore = useAdjustmentsStore()

const { products } = storeToRefs(productStore)
const { employees } = storeToRefs(employeeStore)
const { physicalInventory } = storeToRefs(physicalInventoryStore)
const { adjustments } = storeToRefs(adjustmentStore)

const PIProducts = {
  product_id: '',
  name: '',
  category: '',
  suppliers: '',
  quantity: 0,
  physical_quantity: 0
}

const model = ref({
  physical_inventory: {
    date_started: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
    date_ended: null,
    status: PhysicalInventoryStatus.DRAFT,
    branch_manager: '',
    inventory_incharge: ''
  },
  items: []
})

// composables
const schema = Joi.object({
  physical_inventory: PhysicalInventorySchema.required(),
  items: Joi.array()
    .items(PhysicalInventoryItemSchema.options({ stripUnknown: true }))
    .min(1)
})
const { errors, hasErrors, validatedData, validateData } = useValidation(
  schema,
  model.value
)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

// product list
const rowPropInit = 'row-prop-init-physical-inventory-form'
Event.on(rowPropInit, (data) => {
  return {
    product: data
  }
})

// adjustment list
const rowPropInitAdjustment = 'row-prop-init-adjustments'
Event.on(rowPropInitAdjustment, (data) => {
  return {
    adjustment: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const isDraft = computed(() => {
  return model.value.physical_inventory.status == PhysicalInventoryStatus.DRAFT
})

const isDone = computed(() => {
  return model.value.physical_inventory.status == PhysicalInventoryStatus.DONE
})

const isViewOrEdit = computed(() => {
  return route.query.id ? true : false
})

const adjustmentsMade = computed(
  () => adjustments
          .value.filter(
            a => a.physical_inventory_id == route.query.id
          )
)

const managerOptions = computed(() => {
  return employees.value
    .filter((emp) => emp.position == UserType.MANAGER)
    .map((emp) => {
      return {
        text: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }
    })
})

const inventoryInchargeOptions = computed(() => {
  return employees.value
    .filter((emp) => emp.position == UserType.INVENTORY)
    .map((emp) => {
      return {
        text: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }
    })
})

/** ================================================
 * METHODS
 ** ================================================*/

const onBackOrCancel = () => {
  router.back()
}

const onCreateAdjustment = () => {
  router.push({
    name: InventoryConst.PHYSICAL_INVENTORY_ADJUSTMENT_FORM,
    params: {
      physical_inventory_id: route.query.id
    }
  })
}

const onSubmit = async (isSaveAsDraft = false) => {
  // Few model values changes
  model.value.physical_inventory.date_ended = DateHelpers.formatDate(
    new Date(),
    'YYYY-MM-DD'
  )
  model.value.physical_inventory.status = isSaveAsDraft
    ? PhysicalInventoryStatus.DRAFT
    : PhysicalInventoryStatus.DONE

  validateData()
  if (hasErrors.value) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Failed to save Physical Inventory. Please check your inputs'
    })
    return
  }

  let isSuccess = false
  if (!isViewOrEdit) {
    isSuccess = await physicalInventoryStore.register(validatedData.value)
  } else {
    isSuccess = await physicalInventoryStore.update(
      route.query.id,
      validatedData.value
    )
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.SUCCESS,
      message: 'Physical Inventory successfully saved.'
    })

    router.push({ name: InventoryConst.PHYSICAL_INVENTORY })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Something went wrong. Please try again.'
    })
  }
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await employeeStore.getEmployees()
  await productStore.getProducts()
  await adjustmentStore.fetchAdjustments()

  if (route.query.id) {
    await physicalInventoryStore.getPhysicalInventory(route.query.id)
    model.value.physical_inventory = ObjectHelpers.assignSameFields(
      model.value.physical_inventory,
      physicalInventory.value
    )

    // patches
    model.value.physical_inventory.date_started = DateHelpers.formatDate(
      new Date(physicalInventory.value.date_started),
      'YYYY-MM-DD'
    )

    // items
    model.value.items = physicalInventory.value.items.map((item) => {
      const product = products.value.find((p) => p.id == item.product_id)
      return {
        product_id: item.product_id,
        name: product.product_details.purchase_description,
        category: product.categories.map((pc) => pc.name).join(':'),
        suppliers: product.suppliers.map((s) => s.company_name).join(', '),
        quantity: item.quantity,
        physical_quantity: item.physical_quantity
      }
    })
  } else {
    model.value.items = products.value.map((p) => {
      return {
        product_id: p.id,
        name: p.product_details.purchase_description,
        category: p.categories.map((pc) => pc.name).join(':'),
        suppliers: p.suppliers.map((s) => s.company_name).join(', '),
        quantity: p.product_details.stock,
        physical_quantity: 0
      }
    })
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
