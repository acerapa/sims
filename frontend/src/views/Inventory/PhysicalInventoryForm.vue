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
          v-model="model.date_started"
          :error="errors.date_started"
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
            name="manager_id"
            :can-search="true"
            label="Branch Manager"
            :error-has-text="true"
            :options="managerOptions"
            v-model="model.manager_id"
            placeholder="Select Manager"
          />
          <CustomInput
            type="select"
            class="flex-1"
            :has-label="true"
            :can-search="true"
            :error-has-text="true"
            v-model="model.manager_id"
            label="Inventory In-Charge"
            name="inventory_incharge_id"
            :options="inventoryInchargeOptions"
            placeholder="Select Inventory In-Charge"
          />
        </div>
      </div>
    </div>
    <div>
      <!-- TODO: Change table to multi table input -->
      <CustomTable
        :has-tools="true"
        title="Product List"
        :row-prop-init="rowPropInit"
        :has-add-btn="false"
        :data="model.products"
        :table-row-component="PhysicalInventoryFormRow"
      >
        <template #table_header>
          <div class="grid grid-cols-7 gap-3">
            <p class="col-span-1 table-header">Category</p>
            <p class="col-span-2 table-header">Item Description</p>
            <p class="col-span-2 table-header">Supplier</p>
            <p class="col-span-1 table-header">Quantity</p>
            <p class="col-span-1 table-header">Physical Count</p>
          </div>
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import PhysicalInventoryFormRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryFormRow.vue'

import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useEmployeeStore } from '@/stores/employee'
import { storeToRefs } from 'pinia'
import { DateHelpers, PhysicalInventoryStatus, UserType } from 'shared'
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import { useRoute } from 'vue-router'

const route = useRoute()

const productStore = useProductStore()
const employeeStore = useEmployeeStore()
const { products } = storeToRefs(productStore)
const { employees } = storeToRefs(employeeStore)

const model = ref({
  date_started: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
  date_ended: null,
  status: PhysicalInventoryStatus.DRAFT,
  branch_manager: '',
  inventory_incharge: '',
  products: []
})

const errors = ref({}) // temporary errors object

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
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await employeeStore.getEmployees()
  await productStore.getProducts()

  if (route.query.id) {
    // TODO: Fetch the physical inventory data by ID
    // and populate the model with the fetched data.
  } else {
    model.value.products = products.value.map((p) => {
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
