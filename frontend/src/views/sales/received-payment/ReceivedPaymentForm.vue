<template>
  <div class="cont flex flex-col gap-3">
    <div class="flex justify-between items-center py-3">
      <h1 class="text-2xl font-bold">Received Payment</h1>
      <CustomInput
        type="date"
        :has-label="true"
        name="payment_date"
        label="Payment Date: "
        v-model="model.payment_date"
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
        label="Select Invoice"
        :options="invoiceOptions"
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
        name="payment_method_id"
        label="Select Payment Method"
        :options="paymentMethodsOptions"
        v-model="model.payment_method_id"
        placeholder="Select Payment Method"
      />

      <CustomInput
        type="number"
        class="flex-1"
        label="Amount"
        name="amount"
        :has-label="true"
        :can-search="true"
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
        label="Select Cashier"
        :options="employeeOptions"
        placeholder="Select Cashier"
        label-css="text-sm font-bold text-gray-500"
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
        v-model="model.memo"
        input-class="resize-none"
        placeholder="Add other notes here ..."
      />
      <div class="flex-1 flex items-end">
        <div class="grid grid-cols-2 gap-5 ml-auto mr-0">
          <!-- Amount Payable -->
          <p class="flex-1 text-sm text-start">Amount Payable:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ 1000.0 }}
          </p>

          <!-- Payment Amount -->
          <p class="flex-1 text-sm text-start">Payment Amount:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ 1000.0 }}
          </p>

          <hr class="col-span-2" />

          <!-- Remaining Balance -->
          <p class="flex-1 text-sm text-start">Remaining Balance:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ 1000.0 }}
          </p>
        </div>
      </div>
    </div>

    <hr />

    <div class="flex gap-3 justify-end">
      <button class="btn-danger-outline">Cancel</button>
      <button class="btn">Submit</button>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useInvoiceStore } from '@/stores/invoice'
import { usePaymentMethodStore } from '@/stores/payment-method'
import { useReceivedPaymentsStore } from '@/stores/received-payments'
import { DateHelpers } from 'shared'
import { computed, onMounted, ref } from 'vue'

const invoiceStore = useInvoiceStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const paymentMethodStore = usePaymentMethodStore()
const receivedPaymentStore = useReceivedPaymentsStore()

const customerId = ref(0)
const model = ref({
  amount: 0,
  remaining_balance: 0,
  payment_date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
  memo: '',
  payment_method_id: 0,
  invoice_id: 0,
  customer_id: 0,
  user_id: 0
})

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
  return invoiceStore.invoices.map((invoice) => {
    const customer = !invoice.sales_order_id
      ? invoice.customer
      : invoice.sales_order.customer

    return {
      text: `${customer.first_name} ${customer.last_name} - #${invoice.id}`,
      invoice: invoice.id
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

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await invoiceStore.getInvoices()
  await customerStore.getCustomers()
  await employeeStore.getEmployees()
  await paymentMethodStore.getPaymentMethods()

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
