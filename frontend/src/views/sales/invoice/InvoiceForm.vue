<template>
  <div class="cont flex flex-col gap-3">
    <div class="flex justify-between items-center py-3">
      <h1 class="text-2xl font-bold">Invoice</h1>
      <CustomInput
        type="date"
        :has-label="true"
        name="invoice_date"
        label="Invoice Date: "
        label-css="text-sm font-bold text-gray-500"
        class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
      />
    </div>
    <hr />
    <div class="flex flex-col gap-3 py-3">
      <div class="flex gap-3">
        <div class="flex-1">
          <CustomInput
            type="select"
            label="From"
            :has-label="true"
            :can-search="true"
            name="employee_id"
            :options="employeeOptions"
            v-model="model.employee_id"
            placeholder="Select Employee"
            class="[&>div>div]:ml-2 w-fit"
          />
          <div
            v-if="employeeInfo && currentBranch.address"
            class="ml-5 text-sm text-gray-600"
          >
            <p class="font-bold">
              {{ UserTypeMap[employeeInfo.position].text }}
            </p>
            <p class="mt-2">{{ currentBranch.address.address1 }}</p>
            <p v-if="currentBranch.address.address2">
              {{ currentBranch.address.address2 }}
            </p>
            <p>
              {{
                [
                  currentBranch.address.city,
                  currentBranch.address.province,
                  currentBranch.address.postal
                ].join(', ')
              }}
            </p>
            <p>{{ employeeInfo.phone_number }}</p>
          </div>
        </div>
        <div class="flex-1">
          <CustomInput
            type="select"
            label="Bill To"
            :has-label="true"
            :can-search="true"
            name="customer_id"
            :has-add-new="true"
            :options="customerOptions"
            v-model="model.customer_id"
            placeholder="Select Customer"
            class="[&>div>div]:ml-2 w-fit"
            @add-new="showCustomerModal = true"
          />
          <div v-if="customerInfo" class="ml-5 text-sm text-gray-600">
            <p class="mt-2">{{ customerInfo.address.address1 }}</p>
            <p v-if="customerInfo.address.address2">
              {{ customerInfo.address.address2 }}
            </p>
            <p>
              {{
                [
                  customerInfo.address.city,
                  customerInfo.address.province,
                  customerInfo.address.postal
                ].join(', ')
              }}
            </p>
            <p>{{ customerInfo.phone_number }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="cont">
    <div class="flex flex-col gap-5" ref="multiSelectWrap">
      <p class="text-lg font-normal">Select Products</p>
      <MultiSelectTable
        :format="invoiceProductModel"
        v-model="model.products"
        :header-component="InvoiceFormHeader"
        :row-component="InvoiceFormRow"
      />
    </div>
  </div>
  <div class="cont flex flex-col gap-5 mb-10">
    <p class="text-lg font-normal">Notes & Summary</p>
    <div class="flex gap-3 justify-between">
      <CustomInput
        name="memo"
        label="Memo"
        class="flex-1"
        type="textarea"
        :rows="6"
        :has-label="true"
        v-model="model.memo"
        input-class="resize-none"
        placeholder="Add other notes here ..."
      />
      <div class="flex-1 flex items-end">
        <div class="grid grid-cols-2 gap-5 ml-auto mr-0">
          <!-- Sub total -->
          <p class="flex-1 text-sm text-start">Sub total:</p>
          <p class="flex-1 text-sm text-end font-bold whitespace-nowrap">
            ₱ 1000.00
          </p>

          <!-- Discount -->
          <p class="flex-1 text-sm text-start">Discount:</p>
          <p class="flex-1 text-sm text-end font-bold whitespace-nowrap">
            ₱ 0.00
          </p>

          <hr class="col-span-2" />

          <!-- Total -->
          <p class="flex-1 text-sm text-start">Total:</p>
          <p class="flex-1 text-sm text-end font-bold whitespace-nowrap">
            ₱ 1000.00
          </p>
        </div>
      </div>
    </div>
    <hr class="mt-3" />
    <div class="flex gap-3 justify-end">
      <button class="btn-danger-outline">Cancel</button>
      <button class="btn">Submit</button>
    </div>
  </div>
  <CustomerModal v-if="showCustomerModal" v-model="showCustomerModal" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import InvoiceFormRow from '@/components/sales/invoice/InvoiceFormRow.vue'
import InvoiceFormHeader from '@/components/sales/invoice/InvoiceFormHeader.vue'

import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useSettingsStore } from '@/stores/settings'
import { UserTypeMap } from 'shared'
import { useTableScroll } from '@/use/useTableScroll'

const customerStore = useCustomerStore()
const { customers } = storeToRefs(customerStore)
const employeeStore = useEmployeeStore()
const { employees } = storeToRefs(employeeStore)
const { getCurrentBranch } = useSettingsStore()

const showCustomerModal = ref(false)

const currentBranch = ref(null)
const multiSelectWrap = ref(null)

const invoiceProductModel = {
  product_id: '',
  description: '',
  quantity: 0,
  price: 0,
  total: 0,
  discount: 0
}

const model = ref({
  memo: '',
  customer_id: null,
  employee_id: null,
  products: [{ ...invoiceProductModel }]
})

// composables
useTableScroll(multiSelectWrap)

/** ================================================
 * COMPUTED
 ** ================================================*/
const customerOptions = computed(() => {
  return customers.value.map((c) => {
    return {
      text: `${c.first_name} ${c.last_name}`,
      value: c.id
    }
  })
})

const employeeOptions = computed(() => {
  return employees.value.map((e) => {
    return {
      text: `${e.first_name} ${e.last_name}`,
      value: e.id
    }
  })
})

const customerInfo = computed(() => {
  return customers.value.find((c) => c.id == model.value.customer_id)
})

const employeeInfo = computed(() => {
  return employees.value.find((e) => e.id == model.value.employee_id)
})

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await customerStore.getCustomers()
  await employeeStore.getEmployees()

  currentBranch.value = await getCurrentBranch()
})
</script>
