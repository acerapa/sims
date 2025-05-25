<template>
  <div class="cont flex flex-col gap-3">
    <div class="flex justify-between items-start py-3">
      <div class="flex gap-5 items-start">
        <div>
          <h1 class="text-2xl font-bold">
            Invoice
            <span class="font-normal ml-3" v-if="invoice"
              >#{{ invoice.id }}</span
            >
          </h1>
          <p v-if="invoice && invoice.sales_order_id">
            Sales Order #{{ invoice.sales_order_id }}
          </p>
        </div>
        <BadgeComponent
          v-if="invoice"
          class="mt-1.5"
          :text="InvoiceStatusMap[invoice.status].text"
          :custom-class="InvoiceStatusMap[invoice.status].class"
        />
      </div>
      <CustomInput
        type="date"
        :has-label="true"
        :disabled="isView"
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
            :disabled="isView"
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
            :disabled="isView"
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
        :has-add-new-item="!isFromSalesOrder"
        :header-component="InvoiceFormHeader"
        :row-component="InvoiceFormRow"
        :row-event-name="rowEventName"
        :is-disabled="isView"
        :row-props="{
          selected: model.products
        }"
      />
    </div>
  </div>
  <!-- Recent customer payments -->
  <div class="cont flex flex-col gap-3" v-if="isView">
    <p class="text-lg font-normal">Recent Customer Payments</p>
    <hr />
    <div>
      <div class="flex flex-col">
        <div class="grid grid-cols-8 mb-4">
          <p class="text-sm font-semibold col-span-2">Date Paid</p>
          <p class="text-sm font-semibold col-span-3">Amount</p>
          <p class="text-sm font-semibold col-span-2">Invoice status</p>
          <p class="text-sm font-semibold col-span-1">Action</p>
        </div>

        <div v-if="receivedInvoicePayments.length">
          <div
            class="grid grid-cols-8 items-center gen-table-row"
            v-for="rp in receivedInvoicePayments"
          >
            <p class="text-sm col-span-2">
              {{
                new Date(rp.payment_date).toLocaleString('default', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })
              }}
            </p>
            <p class="text-sm col-span-3">₱ {{ rp.amount }}</p>
            <div class="col-span-2">
              <BadgeComponent
                :text="InvoiceStatusMap[rp.invoice_status].text"
                :custom-class="InvoiceStatusMap[rp.invoice_status].class"
              />
            </div>
            <RouterLink
              :to="{
                name: SalesConst.RECEIVED_PAYMENT_FORM,
                query: { id: rp.id }
              }"
              class="btn-outline col-span-1 w-fit"
              >view</RouterLink
            >
          </div>
        </div>
        <p v-else class="text-sm text-gray-600 text-center">No Data</p>
      </div>
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
        :disabled="isView"
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
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ model.invoice.discount.toFixed(2) }}
          </p>

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
      <button class="btn-danger-outline" @click="onBackOrCancel">
        {{ isView ? 'Back' : 'Cancel' }}
      </button>
      <button v-if="isView && !isPaid" class="btn" @click="onCustomerPayment">
        Customer payment
      </button>
      <button v-if="!isView" class="btn" @click="onSubmit">Submit</button>
    </div>
  </div>
  <CustomerModal v-if="showCustomerModal" v-model="showCustomerModal" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import BadgeComponent from '@/components/shared/BadgeComponent.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import InvoiceFormRow from '@/components/sales/invoice/InvoiceFormRow.vue'
import InvoiceFormHeader from '@/components/sales/invoice/InvoiceFormHeader.vue'

import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useSettingsStore } from '@/stores/settings'
import {
  DateHelpers,
  InvoiceStatus,
  InvoiceStatusMap,
  InvoiceWithProductsSchema,
  ObjectHelpers,
  UserTypeMap
} from 'shared'
import { useTableScroll } from '@/use/useTableScroll'
import { useValidation } from '@/composables/useValidation'
import Event from '@/event'
import { useInvoiceStore } from '@/stores/invoice'
import { EventEnum } from '@/data/event'
import { SalesConst } from '@/const/route.constants'
import { ToastTypes } from '@/data/types'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { useReceivedPaymentsStore } from '@/stores/received-payments'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()
const { customers } = storeToRefs(customerStore)
const employeeStore = useEmployeeStore()
const { employees } = storeToRefs(employeeStore)
const { getCurrentBranch } = useSettingsStore()
const salesStore = useSalesStore()
const invoiceStore = useInvoiceStore()
const receivedPaymentStore = useReceivedPaymentsStore()
const { invoice } = storeToRefs(invoiceStore)
const { receivedInvoicePayments } = storeToRefs(receivedPaymentStore)

const showCustomerModal = ref(false)

const currentBranch = ref(null)
const multiSelectWrap = ref(null)
const rowEventName = ref('invoice-form-row-event')

const invoiceProductModel = {
  product_id: '',
  quantity: 0,
  discount: 0.0,
  serial_number: '',
  price: 0,
  total: 0
}

const model = ref({
  invoice: {
    employee_id: '',
    customer_id: '',
    memo: '',
    sales_order_id: '',
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
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

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

const isView = computed(() => {
  return !!route.query.id
})

const isPaid = computed(
  () => invoice.value && invoice.value.status === InvoiceStatus.PAID
)

const isFromSalesOrder = computed(() => {
  return !!route.query.sales_order_id
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validation
  validateData()

  if (hasErrors.value) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Failed to create invoice. Please check your inputs'
    })
    if (errors.value.products) {
      Event.emit(rowEventName.value, errors.value.products)
    }
    return
  }

  // create invoice
  let isSuccess = false

  let data = { ...model.value }
  if (isFromSalesOrder.value) {
    delete data.invoice.customer_id
    delete data.invoice.employee_id
    delete data.products
  }
  isSuccess = await invoiceStore.createInvoice(model.value)

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.SUCCESS,
      message: 'Invoice created successfully'
    })

    router.push({ name: SalesConst.INVOICES })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Failed to create invoice'
    })
  }
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

const onBackOrCancel = () => {
  router.back()
}

const populateFormWithInvoiceData = async () => {
  const isSuccess = await invoiceStore.fetchInvoiceById(route.query.id)

  if (isSuccess) {
    if (invoice.value.sales_order_id) {
      populateFormWithSalesOrderData(invoice.value.sales_order)
    } else {
      model.value.invoice = ObjectHelpers.assignSameFields(
        { ...model.value.invoice },
        invoice.value
      )

      model.value.invoice.total = parseFloat(invoice.value.total)
      model.value.invoice.discount = parseFloat(invoice.value.discount)
      model.value.invoice.sub_total = parseFloat(invoice.value.sub_total)

      model.value.invoice.issue_date = DateHelpers.formatDate(
        invoice.value.issue_date,
        'YYYY-MM-DD'
      )

      model.value.products = invoice.value.products.map((p) => {
        return ObjectHelpers.assignSameFields(
          { ...invoiceProductModel },
          p.InvoiceProducts
        )
      })
    }
  }
}

const populateFormWithSalesOrderData = async (salesOrder = null) => {
  if (!salesOrder) {
    salesOrder = await salesStore.getSalesOrder(route.query.sales_order_id)
  }

  if (salesOrder) {
    model.value.invoice.customer_id = salesOrder.customer_id
    model.value.invoice.employee_id = salesOrder.user_id
    model.value.invoice.sales_order_id = salesOrder.id
  }

  // Map products
  model.value.products = salesOrder.products.map((p) => {
    return ObjectHelpers.assignSameFields(
      { ...invoiceProductModel },
      p.SalesOrderProduct
    )
  })
}

const onCustomerPayment = () => {
  router.push({
    name: SalesConst.RECEIVED_PAYMENT_FORM,
    query: {
      invoice_id: route.query.id
    }
  })
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await customerStore.getCustomers()
  await employeeStore.getEmployees()

  currentBranch.value = await getCurrentBranch()

  if (route.query.id) {
    await receivedPaymentStore.fetchReceivedPaymentsByInvoiceId(route.query.id)
    populateFormWithInvoiceData()
  } else if (route.query.sales_order_id) {
    populateFormWithSalesOrderData()
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

onBeforeRouteLeave(() => {
  // clear the invoice store
  if (route.query.id) {
    invoiceStore.invoice = null
  }
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

    model.value.invoice.discount = model.value.products
      .filter((p) => p.product_id && p.discount)
      .map((p) => (p.discount ? parseFloat(p.discount) : 0.0))
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
