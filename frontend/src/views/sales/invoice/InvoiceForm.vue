<template>
  <div class="cont flex flex-col gap-3">
    <div class="flex justify-between items-center py-3">
      <h1 class="text-2xl font-bold">Invoice</h1>
      <CustomInput
        type="date"
        :has-label="true"
        name="invoice_date"
        label="Issue Date: "
        v-model="model.invoice.issue_date"
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
            :error-has-text="true"
            :options="employeeOptions"
            placeholder="Select Employee"
            v-model="model.invoice.employee_id"
            :error="errors.invoice?.employee_id"
            class="[&>div>div]:ml-2 w-fit [&>div>.error]:ml-2"
            @focus="() => onFocusResetError('invoice.employee_id')"
          />
          <div
            v-if="employeeInfo && currentBranch.address"
            class="ml-5 mt-3.5 text-sm text-gray-600"
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
            :error-has-text="true"
            :options="customerOptions"
            placeholder="Select Customer"
            v-model="model.invoice.customer_id"
            @add-new="showCustomerModal = true"
            :error="errors.invoice?.customer_id"
            @focus="onFocusResetError('invoice.customer_id')"
            class="[&>div>div]:ml-2 w-fit [&>div>.error]:ml-2"
          />
          <div v-if="customerInfo" class="ml-5 mt-3.5 text-sm text-gray-600">
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
        :row-event-name="rowEventName"
        :row-props="{
          selected: model.products
        }"
      />
    </div>
  </div>
  <div class="cont flex flex-col gap-5 mb-10">
    <p class="text-lg font-normal">Notes & Summary</p>
    <div class="flex gap-8 justify-between">
      <CustomInput
        name="memo"
        label="Memo"
        class="flex-1"
        type="textarea"
        :rows="6"
        :has-label="true"
        input-class="resize-none"
        v-model="model.invoice.memo"
        placeholder="Add other notes here ..."
      />
      <div class="flex-1 flex items-end">
        <div class="grid grid-cols-2 gap-5 ml-auto mr-0">
          <!-- Sub total -->
          <p class="flex-1 text-sm text-start">Sub total:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ model.invoice.sub_total.toFixed(2) }}
          </p>

          <!-- Discount -->
          <p class="flex-1 text-sm text-start">Discount:</p>
          <div class="flex items-center gap-2">
            <p>₱</p>
            <CustomInput
              type="number"
              class="w-full"
              name="discount"
              placeholder="0.00"
              input-class="text-end w-full"
              v-model="model.invoice.discount"
            />
          </div>

          <hr class="col-span-2" />

          <!-- Total -->
          <p class="flex-1 text-sm text-start">Total:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ model.invoice.total.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
    <hr class="mt-3" />
    <div class="flex gap-3 justify-end">
      <button class="btn-danger-outline">Cancel</button>
      <button class="btn" @click="onSubmit">Submit</button>
    </div>
  </div>
  <CustomerModal v-if="showCustomerModal" v-model="showCustomerModal" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import InvoiceFormRow from '@/components/sales/invoice/InvoiceFormRow.vue'
import InvoiceFormHeader from '@/components/sales/invoice/InvoiceFormHeader.vue'

import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useSettingsStore } from '@/stores/settings'
import { DateHelpers, InvoiceWithProductsSchema, UserTypeMap } from 'shared'
import { useTableScroll } from '@/use/useTableScroll'
import { useValidation } from '@/composables/useValidation'
import Event from '@/event'
import { useInvoiceStore } from '@/stores/invoice'

const customerStore = useCustomerStore()
const { customers } = storeToRefs(customerStore)
const employeeStore = useEmployeeStore()
const { employees } = storeToRefs(employeeStore)
const { getCurrentBranch } = useSettingsStore()
const { createInvoice } = useInvoiceStore()

const showCustomerModal = ref(false)

const currentBranch = ref(null)
const multiSelectWrap = ref(null)
const rowEventName = ref('invoice-form-row-event')

const invoiceProductModel = {
  product_id: '',
  quantity: 0,
  price: 0,
  total: 0
}

const model = ref({
  invoice: {
    employee_id: '',
    customer_id: '',
    memo: '',
    issue_date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
    due_date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
    discount: 0.0,
    sub_total: 0.0,
    total: 0.0
  },
  products: [{ ...invoiceProductModel }]
})

// composables
useTableScroll(multiSelectWrap)
const { errors, hasErrors, validateData } = useValidation(
  InvoiceWithProductsSchema,
  model.value
)

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
  return customers.value.find((c) => c.id == model.value.invoice.customer_id)
})

const employeeInfo = computed(() => {
  return employees.value.find((e) => e.id == model.value.invoice.employee_id)
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validation
  validateData()

  if (hasErrors.value) {
    if (errors.value.products) {
      Event.emit(rowEventName.value, errors.value.products)
    }
    return
  }

  // create invoice
  let isSuccess = false
  isSuccess = await createInvoice(model.value)

  if (!isSuccess) return
  console.log('invoice created')
}

const onFocusResetError = (path) => {
  if (!errors.value) return
  const keys = path.split('.')

  if (keys.length == 1) {
    errors.value[keys[0]] = ''
  } else {
    let val = errors.value
    for (let key of keys) {
      if (!val[key]) break

      if (val[key] && typeof val[key] === 'string') {
        val[key] = ''
        break
      } else {
        val = val[key]
      }
    }
  }
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await customerStore.getCustomers()
  await employeeStore.getEmployees()

  currentBranch.value = await getCurrentBranch()
})

/** ================================================
 * WATCHERS
 * ================================================*/
watch(
  () => model.value.products,
  () => {
    model.value.invoice.sub_total = model.value.products
      .filter((p) => p.product_id && p.total)
      .map((p) => (p.total ? parseFloat(p.total) : 0.0))
      .reduce((acc, curr) => acc + curr, 0)
  },
  { deep: true }
)

watch(
  () => [model.value.invoice.discount, model.value.invoice.sub_total],
  () => {
    model.value.invoice.total =
      model.value.invoice.sub_total - model.value.invoice.discount
  }
)
</script>
