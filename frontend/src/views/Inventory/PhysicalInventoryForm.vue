<template>
  <div class="flex flex-col gap-4">
    <div class="cont flex flex-col gap-4">
      <div class="flex justify-between items-center !py-2 !pb-3">
        <h1 class="text-2xl font-bold">Physical Inventory Form</h1>
        <CustomInput
          type="date"
          :has-label="true"
          name="date_started"
          label="Date Started:"
          :error-has-text="true"
          :disabled="true"
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
          />
        </div>
      </div>
    </div>
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
        :row-component="PhysicalInventoryFormRow"
        :header-component="PhysicalInventoryFormHeader"
      >
      </MultiSelectTable>

      <div class="flex justify-end gap-3">
        <button class="btn-danger-outline">Cancel</button>
        <button class="btn-outline">Save as Draft</button>
        <button class="btn-green" @click="onSubmit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import PhysicalInventoryFormRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryFormRow.vue'
import PhysicalInventoryFormHeader from '@/components/Inventory/PhysicalInventory/PhysicalInventoryFormHeader.vue'

import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useEmployeeStore } from '@/stores/employee'
import { storeToRefs } from 'pinia'
import {
  DateHelpers,
  Joi,
  PhysicalInventoryItemSchema,
  PhysicalInventorySchema,
  PhysicalInventoryStatus,
  UserType
} from 'shared'
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import { useRoute } from 'vue-router'
import { useValidation } from '@/composables/useValidation'

const route = useRoute()

const productStore = useProductStore()
const employeeStore = useEmployeeStore()
const { products } = storeToRefs(productStore)
const { employees } = storeToRefs(employeeStore)

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

const rowPropInit = 'rrow-prop-init-physical-inventory-form'
Event.on(rowPropInit, (data) => {
  return {
    product: data
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
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
const onSubmit = async () => {
  validateData()
  if (hasErrors.value) {
    console.log(errors.value)
    return
  }

  // TODO: Use the validated data to submit the physical inventory form.
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await employeeStore.getEmployees()
  await productStore.getProducts()

  if (route.query.id) {
    // TODO: Fetch the physical inventory data by ID
    // and populate the model with the fetched data.
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
