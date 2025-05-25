<template>
  <div class="cont flex flex-col gap-3">
    <div class="flex justify-between items-center py-3">
      <h1 class="text-2xl font-bold">Received Payment</h1>
      <CustomInput
        type="date"
        :has-label="true"
        :disabled="isView"
        name="payment_date"
        label="Payment Date: "
        :error-has-text="true"
        v-model="model.payment_date"
        :error="errors.payment_date"
        label-css="text-sm font-bold text-gray-500"
        class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
      />
    </div>
    <hr />

    <div class="flex gap-5 py-3">
      <CustomInput
        type="select"
        class="flex-1"
        :has-label="true"
        name="customer_id"
        :can-search="true"
        :disabled="isView"
        v-model="customerId"
        label="Select Customer"
        :options="customerOptions"
        placeholder="Select Customer"
      />
      <CustomInput
        type="select"
        class="flex-1"
        name="invoice_id"
        :has-label="true"
        :can-search="true"
        :disabled="isView"
        label="Select Invoice"
        :error-has-text="true"
        :options="invoiceOptions"
        :error="errors.invoice_id"
        v-model="model.invoice_id"
        placeholder="Select Invoice"
      />
    </div>

    <div class="flex gap-5 py-3">
      <CustomInput
        type="select"
        class="flex-1"
        :has-label="true"
        :can-search="true"
        :disabled="isView"
        :error-has-text="true"
        name="payment_method_id"
        label="Select Payment Method"
        :options="paymentMethodsOptions"
        v-model="model.payment_method_id"
        :error="errors.payment_method_id"
        placeholder="Select Payment Method"
      />

      <CustomInput
        step="0.01"
        type="number"
        name="amount"
        class="flex-1"
        label="Amount"
        :has-label="true"
        :can-search="true"
        :disabled="isView"
        :error="errors.amount"
        :error-has-text="true"
        v-model="model.amount"
        placeholder="Enter Amount"
      />
    </div>
  </div>

  <div class="cont flex flex-col gap-5 mb-10">
    <div class="flex justify-between">
      <p class="text-lg font-normal">Note & Summary</p>
      <CustomInput
        type="select"
        name="user_id"
        :has-label="true"
        :can-search="true"
        :disabled="isView"
        :error-has-text="true"
        :error="errors.user_id"
        v-model="model.user_id"
        :options="employeeOptions"
        :placeholder="'Select Cashier'"
        label-css="text-sm font-bold text-gray-500"
        :label="isView ? 'Cashier' : 'Select Cashier'"
        class="[&>div]:gap-3 [&>div]:items-start [&>div]:flex-row w-fit [&>div>small]:mt-[10px]"
      />
    </div>

    <div class="flex gap-8 justify-between">
      <CustomInput
        name="memo"
        label="Memo"
        class="flex-1"
        type="textarea"
        :rows="6"
        :has-label="true"
        :disabled="isView"
        v-model="model.memo"
        :error="errors.memo"
        :error-has-text="true"
        input-class="resize-none"
        placeholder="Add other notes here ..."
      />
      <div class="flex-1 flex items-end">
        <div class="grid grid-cols-2 gap-5 ml-auto mr-0">
          <!-- Amount Payable -->
          <p class="flex-1 text-sm text-start">Amount Payable:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱
            {{ parseFloat(model.amounts_payable).toFixed(2) }}
          </p>

          <!-- Payment Amount -->
          <p class="flex-1 text-sm text-start">Payment Amount:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ parseFloat(model.amount || 0).toFixed(2) }}
          </p>

          <hr class="col-span-2" />

          <!-- Remaining Balance -->
          <p class="flex-1 text-sm text-start">Remaining Balance:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ model.remaining_balance.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>

    <hr />

    <div class="flex gap-3 justify-end">
      <button
        :class="isView ? 'btn-gray-outline' : 'btn-danger-outline'"
        @click="onBackOrCancel"
      >
        {{ isView ? 'Back' : 'Cancel' }}
      </button>
      <button class="btn" @click="onSubmit" v-if="!isView">Submit</button>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { useAuth } from '@/composables/useAuth'
import { useValidation } from '@/composables/useValidation'
import { SalesConst } from '@/const/route.constants'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import Event from '@/event'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useInvoiceStore } from '@/stores/invoice'
import { usePaymentMethodStore } from '@/stores/payment-method'
import { useReceivedPaymentsStore } from '@/stores/received-payments'
import { DateHelpers, ReceivePaymentsSchema } from 'shared'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const invoiceStore = useInvoiceStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const paymentMethodStore = usePaymentMethodStore()
const receivedPaymentStore = useReceivedPaymentsStore()

const customerId = ref(null)
const selectedInvoice = ref(null)
const latestReceivedPayment = ref(null)
const model = ref({
  amounts_payable: 0,
  amount: 0,
  remaining_balance: 0,
  payment_date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
  memo: '',
  payment_method_id: '',
  invoice_id: '',
  user_id: ''
})

// composables
const { errors, hasErrors, validateData } = useValidation(
  ReceivePaymentsSchema,
  model.value
)

const { getAuthUser } = useAuth()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const customerOptions = computed(() => {
  return customerStore.customers.map((customer) => {
    return {
      text: `${customer.first_name} ${customer.last_name}`,
      value: customer.id
    }
  })
})

const invoiceOptions = computed(() => {
  return invoiceStore.invoices
    .filter((invoice) => {
      const customer = !invoice.sales_order_id
        ? invoice.customer
        : invoice.sales_order.customer
      return customerId.value ? customer.id === customerId.value : true
    })
    .map((invoice) => {
      const customer = !invoice.sales_order_id
        ? invoice.customer
        : invoice.sales_order.customer

      return {
        text: `${customer.first_name} ${customer.last_name} - #${invoice.id}`,
        value: invoice.id
      }
    })
})

const paymentMethodsOptions = computed(() => {
  return paymentMethodStore.paymentMethods.map((pm) => {
    return {
      text: pm.name,
      value: pm.id
    }
  })
})

const employeeOptions = computed(() => {
  return employeeStore.employees.map((e) => {
    return {
      text: `${e.first_name} ${e.last_name}`,
      value: e.id
    }
  })
})

const isView = computed(() => (route.query.id ? true : false))

const hasInvoiceId = computed(() => (route.query.invoice_id ? true : false))

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  validateData()

  if (hasErrors.value) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Please fill up the required fields.'
    })
    return
  }

  const isSuccess = await receivedPaymentStore.registerReceivedPayment(
    model.value
  )

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.SUCCESS,
      message: 'Received Payment successfully!'
    })

    router.push({ name: SalesConst.RECEIVED_PAYMENTS })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      type: ToastTypes.ERROR,
      message: 'Failed to create received payment.'
    })
  }
}

const onBackOrCancel = () => {
  router.back()
}

const getAndPopulatePaymentData = async (id) => {
  const receivedPayment = await receivedPaymentStore.getReceivedPaymentsById(id)

  if (receivedPayment) {
    model.value.invoice_id = receivedPayment.invoice_id
    model.value.amount = parseFloat(receivedPayment.amount).toFixed(2)
    model.value.amounts_payable = parseFloat(receivedPayment.amounts_payable)
    model.value.remaining_balance = parseFloat(
      receivedPayment.remaining_balance
    )
    model.value.payment_method_id = receivedPayment.payment_method_id
    model.value.user_id = receivedPayment.user_id
    model.value.memo = receivedPayment.memo
    model.value.payment_date = DateHelpers.formatDate(
      receivedPayment.payment_date,
      'YYYY-MM-DD'
    )
  }
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await invoiceStore.getInvoices()
  await customerStore.getCustomers()
  await employeeStore.getEmployees()
  await paymentMethodStore.getPaymentMethods()

  const authUser = await getAuthUser()

  if (authUser) {
    model.value.user_id = authUser.id
  }

  if (hasInvoiceId.value) {
    model.value.invoice_id = route.query.invoice_id
  }

  if (isView.value) {
    await getAndPopulatePaymentData(route.query.id)
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 * ================================================*/
watch(
  () => model.value.invoice_id,
  async () => {
    selectedInvoice.value = await invoiceStore.getInvoiceById(
      model.value.invoice_id
    )

    latestReceivedPayment.value =
      await receivedPaymentStore.fetchLatestReceivedPaymentsByInvoiceId(
        model.value.invoice_id
      )

    if (selectedInvoice.value) {
      if (!isView.value) {
        model.value.amounts_payable = latestReceivedPayment.value
          ? latestReceivedPayment.value.remaining_balance
          : selectedInvoice.value.total
      }
      customerId.value = selectedInvoice.value.sales_order_id
        ? selectedInvoice.value.sales_order.customer_id
        : selectedInvoice.value.customer_id
    }

    // Attempt to set remaining balance
    model.value.remaining_balance =
      model.value.amounts_payable - model.value.amount
  }
)

watch(
  () => model.value.amount,
  () => {
    if (!model.value.amounts_payable) return
    model.value.remaining_balance =
      model.value.amounts_payable - model.value.amount
  }
)
</script>
