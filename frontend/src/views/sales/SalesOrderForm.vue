<template>
  <div class="cont flex flex-col gap-5">
    <div class="flex justify-between items-center py-3">
      <h1 class="text-2xl font-bold">
        Sales Order
        <span class="font-normal ml-3" v-if="isEdit"
          >#{{ route.query.id }}</span
        >
      </h1>
      <CustomInput
        type="date"
        :has-label="true"
        name="purchase_date"
        label="Purchase Date:"
        :error-has-text="true"
        :disabled="isEdit"
        v-model="model.sales_order.purchase_date"
        :error="errors.sales_order?.purchase_date"
        class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
      />
    </div>
    <hr />
    <div class="flex justify-between items-center">
      <p class="text-lg font-normal mb-1">Sales Order Information</p>
      <div class="flex gap-3 items-center" v-if="isEdit">
        <SelectStatusDropdown
          v-model="model.sales_order.status"
          :status-map="SalesOrderStatusMap"
          :class="isInvoicedOrCancelled ? 'pointer-events-none' : ''"
        />
        <button
          class="btn-green"
          @click="onGenerateInvoice"
          v-if="!isInvoicedOrCancelled"
        >
          Generate Invoice
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4 py-4">
      <div class="flex gap-3">
        <CustomInput
          label="From"
          type="select"
          name="user_id"
          class="flex-1"
          :has-label="true"
          :can-search="true"
          :has-add-new="true"
          :error-has-text="true"
          placeholder="Prepared By"
          :options="employeeOptions"
          :disabled="isInvoicedOrCancelled"
          v-model="model.sales_order.user_id"
          @add-new="showEmployeeModal = true"
          :error="errors.sales_order?.user_id"
        />
        <CustomInput
          type="select"
          class="flex-1"
          label="Customer"
          :has-label="true"
          :has-add-new="true"
          name="customer_id"
          :can-search="true"
          :disabled="isEdit"
          :error-has-text="true"
          :options="customerOptions"
          placeholder="Select Customer"
          @add-new="showCustomerModel = true"
          :key="model.sales_order.customer_id"
          v-model="model.sales_order.customer_id"
          :error="errors.sales_order?.customer_id"
        />
      </div>
      <div class="flex flex-col gap-3 flex-1">
        <div class="flex gap-3">
          <CustomInput
            type="select"
            class="flex-1"
            :options="[
              {
                text: 'One-Time',
                value: SalesOrderType.ONE_TIME
              },
              {
                text: 'Installment',
                value: SalesOrderType.INSTALLMENT
              }
            ]"
            :has-label="true"
            name="customer_id"
            label="Order Type"
            :error-has-text="true"
            placeholder="Order Type"
            v-model="model.sales_order.type"
            :disabled="isInvoicedOrCancelled"
            :error="errors.sales_order?.type"
          />
          <CustomInput
            type="select"
            class="flex-1"
            :has-label="true"
            :has-add-new="true"
            label="Payment Method"
            :error-has-text="true"
            name="payment_method_id"
            :options="paymentMethodOptions"
            :disabled="isInvoicedOrCancelled"
            placeholder="Select Payment Method"
            @add-new="paymentMethodModal = true"
            v-model="model.sales_order.payment_method_id"
            :error="errors.sales_order?.payment_method_id"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="cont">
    <div class="flex gap-3">
      <input
        type="checkbox"
        id="has-delivery"
        name="has-delivery"
        v-model="model.sales_order.has_delivery"
        :change="
          model.sales_order.has_delivery
            ? (deliveryFormState.hideBody = false)
            : ''
        "
      />
      <label for="has-delivery" class="text-sm">Has Delivery?</label>
    </div>
    <div
      class="delivery-info"
      v-if="!deliveryFormState.hideBody"
      :class="model.sales_order.has_delivery ? 'show' : 'hide'"
      @animationend="
        deliveryFormState.hideBody = !model.sales_order.has_delivery
      "
    >
      <p class="font-semibold mt-3">
        Delivery Information <span class="italic font-thin">(Optional)</span>
      </p>
      <div class="flex gap-3 mt-3">
        <CustomInput
          type="date"
          class="flex-1"
          :has-label="true"
          name="delivery_date"
          label="Delivery Date"
          :error-has-text="true"
          :disabled="isInvoicedOrCancelled"
          v-model="model.delivery.delivery_date"
          :error="errors.delivery?.delivery_date"
        />
        <CustomInput
          type="text"
          class="flex-1"
          name="courier"
          label="Courier"
          :has-label="true"
          placeholder="Courier"
          :error-has-text="true"
          v-model="model.delivery.courier"
          :disabled="isInvoicedOrCancelled"
          :error="errors.delivery?.courier"
        />
      </div>
      <div class="flex gap-3 mt-5">
        <input
          type="checkbox"
          id="use-customer-address"
          name="use-customer-address"
          v-model="model.delivery.use_customer_address"
        />
        <label for="use-customer-address" class="text-sm">
          Use customer address?
        </label>
      </div>
      <div class="mt-3 flex flex-col gap-1 pb-10">
        <p class="text-sm font-semibold">Shipment Address</p>
        <AddressForm
          :has-label="true"
          v-model="model.delivery.address"
          :address-errors="errors.delivery?.address"
          :disabled="
            model.delivery.use_customer_address || isInvoicedOrCancelled
          "
        />
      </div>
    </div>
  </div>

  <div class="cont flex flex-col gap-5">
    <p class="text-lg font-normal">Select Products</p>
    <div ref="multiSelectTable">
      <MultiSelectTable
        :header-component="SalesOrderFormHeader"
        :row-component="SalesOrderFormRow"
        v-model="model.sales_order_products"
        :format="{ ...productTransferModal }"
        :row-event-name="rowEventName"
        :row-props="{
          selected: model.sales_order_products
        }"
        :is-disabled="isInvoicedOrCancelled"
      ></MultiSelectTable>
    </div>
  </div>

  <div class="cont flex flex-col gap-5 mb-10">
    <p class="text-lg font-normal">Notes & Summary</p>
    <div class="flex gap-8 justify-between">
      <CustomInput
        :rows="6"
        name="memo"
        label="Memo"
        class="flex-1"
        type="textarea"
        :has-label="true"
        :error-has-text="true"
        input-class="resize-none"
        v-model="model.sales_order.memo"
        :error="errors.sales_order?.memo"
        :disabled="isInvoicedOrCancelled"
        placeholder="Add other notes here ..."
      />
      <div class="flex-1 flex items-end">
        <div class="grid grid-cols-2 gap-5 ml-auto mr-0">
          <!-- Sub total -->
          <p class="flex-1 text-sm text-start">Sub total:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ parseFloat(model.sales_order.sub_total).toFixed(2) }}
          </p>

          <!-- Total Discount -->
          <p class="flex-1 text-sm text-start">Total Discount:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ parseFloat(model.sales_order.total_discount).toFixed(2) }}
          </p>

          <hr class="col-span-2" />

          <!-- Total -->
          <p class="flex-1 text-sm text-start">Total:</p>
          <p class="flex-1 text-sm text-end font-semibold whitespace-nowrap">
            ₱ {{ parseFloat(model.sales_order.total).toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
    <hr />
    <div
      class="flex gap-3 mt-6"
      :class="route.query.id && !isInvoiced ? 'justify-between' : 'justify-end'"
    >
      <button
        class="btn-danger-outline"
        @click="showDeleteModal = true"
        v-if="route.query.id && !isInvoicedOrCancelled"
      >
        Delete
      </button>
      <div class="flex gap-3">
        <RouterLink :to="{ name: SalesConst.SALES }" class="btn-gray-outline">
          {{ isInvoicedOrCancelled ? 'Back' : 'Cancel' }}
        </RouterLink>
        <RouterLink
          :to="{
            name: SalesConst.INVOICE_FORM,
            query: {
              id: salesOrder.invoice.id
            }
          }"
          v-if="isInvoiced"
          class="btn-green"
          >Check Invoice</RouterLink
        >
        <button
          type="button"
          class="btn-outline"
          v-if="!route.query.id"
          @click="onSubmit(true)"
        >
          Save and New
        </button>
        <button
          type="button"
          class="btn"
          v-if="!route.query.id"
          @click="onSubmit(false)"
        >
          Save
        </button>

        <!-- edit page save button -->
        <button
          type="button"
          class="btn"
          v-if="route.query.id && !isInvoicedOrCancelled"
          @click="onSubmit(false)"
        >
          Update
        </button>
      </div>
    </div>
  </div>
  <PaymentMethodModal v-if="paymentMethodModal" v-model="paymentMethodModal" />
  <CustomerModal v-if="showCustomerModel" v-model="showCustomerModel" />
  <EmployeeModal v-if="showEmployeeModal" v-model="showEmployeeModal" />
  <DeleteConfirmModal
    v-if="showDeleteModal && route.query.id"
    v-model="showDeleteModal"
    :href="`sales-order/${route.query.id}`"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import Event from '@/event'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { EventEnum } from '@/data/event'
import {
  DateHelpers,
  ObjectHelpers,
  SalesOrderCreateSchema,
  SalesOrderStatus,
  SalesOrderStatusMap,
  SalesOrderType
} from 'shared'

import AddressForm from '@/components/shared/AddressForm.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import SalesOrderFormRow from '@/components/sales/SalesOrderFormRow.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import SalesOrderFormHeader from '@/components/sales/SalesOrderFormHeader.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import PaymentMethodModal from '@/components/sales/payment-method/PaymentMethodModal.vue'
import EmployeeModal from '@/components/Employee/EmployeeModal.vue'
import SelectStatusDropdown from '@/components/stock-transfer/SelectStatusDropdown.vue'

import { InventoryConst, SalesConst } from '../../const/route.constants'
import { useCustomerStore } from '@/stores/customer'
import { useSalesStore } from '@/stores/sales'
import { ToastTypes } from '@/data/types'
import { usePaymentMethodStore } from '@/stores/payment-method'
import { useTableScroll } from '@/use/useTableScroll'
import { useEmployeeStore } from '@/stores/employee'
import { useValidation } from '@/composables/useValidation'
import { useAppStore } from '@/stores/app'
import { PageStateConst } from '@/const/state.constants'
import { useAuth } from '@/composables/useAuth'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()

const authUser = ref(null)
const showDeleteModal = ref(false)
const showCustomerModel = ref(false)
const showEmployeeModal = ref(false)
const paymentMethodModal = ref(false)
const deliveryFormState = reactive({
  show: false,
  hideBody: true
})
const rowEventName = 'sales-order-row-event'

// stores
const appStore = useAppStore()
const salesStore = useSalesStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const paymentMethodStore = usePaymentMethodStore()

const { salesOrder } = storeToRefs(salesStore)

// composables
const { getAuthUser } = useAuth()

const productTransferModal = {
  product_id: '',
  description: '',
  quantity: 0,
  price: 0,
  total: 0,
  discount: 0,
  serial_number: ''
}

const defaultModel = {
  sales_order: {
    memo: '',
    type: '',
    user_id: '',
    customer_id: '',
    has_delivery: false,
    payment_method_id: '',
    sub_total: 0.0,
    total: 0.0,
    total_discount: 0.0,
    status: SalesOrderStatus.OPEN,
    purchase_date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD')
  },
  sales_order_products: [{ ...productTransferModal }]
}

const deliveryDefaultModel = {
  courier: '',
  address_id: '',
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  },
  use_customer_address: false,
  delivery_date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD')
}

const model = ref(ObjectHelpers.copyObj(defaultModel))
// composables
const { errors, validateData, hasErrors } = useValidation(
  SalesOrderCreateSchema,
  model.value
)
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const isEdit = computed(() => (route.query.id ? true : false))
const customerOptions = computed(() => {
  return customerStore.customers.map((customer) => {
    return {
      text: `${customer.first_name} ${customer.last_name}`,
      value: customer.id
    }
  })
})

const paymentMethodOptions = computed(() =>
  paymentMethodStore.paymentMethods.map((pm) => ({
    text: pm.name,
    value: pm.id
  }))
)

const employeeOptions = computed(() =>
  employeeStore.employees.map((employee) => {
    return {
      text: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }
  })
)

const isInvoiced = computed(() => {
  return model.value.sales_order.status === SalesOrderStatus.INVOICED
})

const isInvoicedOrCancelled = computed(() => {
  return (
    isInvoiced.value ||
    model.value.sales_order.status === SalesOrderStatus.CANCELLED
  )
})

/** ================================================
 * METHODS
 ** ================================================*/

const onSubmit = async (saveAndNew) => {
  // validation
  validateData()

  if (hasErrors.value) {
    Event.emit(rowEventName, errors.value.sales_order_products)
    return
  }

  let isSuccess = false

  if (route.query.id) {
    isSuccess = await salesStore.updateSalesOrder(route.query.id, model.value)
  } else {
    isSuccess = await salesStore.createSalesOrder(model.value)
  }

  if (isSuccess) {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${route.query.id ? 'updated' : 'created'} Sales Order!`,
      type: ToastTypes.SUCCESS
    })

    if (saveAndNew) {
      model.value = ObjectHelpers.copyObj(defaultModel)
      model.value.sales_order.user_id = authUser.value.id
    } else {
      router.push({
        name: SalesConst.SALES_ORDER
      })
    }
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${route.query.id ? 'update' : 'create'} Sales Order!`,
      type: ToastTypes.ERROR
    })
  }
}

const onGenerateInvoice = async () => {
  router.push({
    name: SalesConst.INVOICE_FORM,
    query: {
      sales_order_id: route.query.id
    }
  })
}

const onAfterDelete = async () => {
  salesStore.removeSalesOrder(route.query.id)
  router.push({
    name: SalesConst.SALES_ORDER
  })
}

const setSalesOrderFormPageState = () => {
  appStore.setPageState(PageStateConst.SALES_ORDER_FORM, {
    route_scope: [SalesConst.SALES_ORDER_FORM, InventoryConst.PRODUCT_FORM],
    state: model.value
  })
}

const populateAddress = (address) => {
  model.value.delivery.address = ObjectHelpers.assignSameFields(
    model.value.delivery.address,
    address
  )
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
const multiSelectTable = ref(null)
useTableScroll(multiSelectTable)
onMounted(async () => {
  await customerStore.getCustomers()
  await employeeStore.getEmployees()
  await paymentMethodStore.getPaymentMethods()

  // set default prepared by
  authUser.value = await getAuthUser()
  if (authUser.value) {
    model.value.sales_order.user_id = authUser.value.id
  }

  if (route.query.id) {
    await salesStore.fetchSalesOrder(route.query.id)

    model.value.sales_order = ObjectHelpers.assignSameFields(
      model.value.sales_order,
      salesOrder.value
    )

    // few dates patches
    model.value.sales_order.purchase_date = salesOrder.value.purchase_date
      ? new Date(salesOrder.value.purchase_date).toISOString().split('T')[0]
      : ''

    // delivery
    if (salesOrder.value.delivery) {
      deliveryFormState.show = true
      deliveryFormState.hideBody = false
      model.value.delivery = ObjectHelpers.assignSameFields(
        deliveryDefaultModel,
        salesOrder.value.delivery
      )

      // address patches
      model.value.delivery.address = {
        address1: salesOrder.value.delivery.address.address1,
        address2: salesOrder.value.delivery.address.address2,
        city: salesOrder.value.delivery.address.city,
        province: salesOrder.value.delivery.address.province,
        postal: salesOrder.value.delivery.address.postal
      }

      // date patches
      model.value.delivery.delivery_date = DateHelpers.formatDate(
        new Date(salesOrder.value.delivery.delivery_date),
        'YYYY-MM-DD'
      )
    }

    // products
    model.value.sales_order_products = salesOrder.value.products.map((p) => {
      let salesProductsModel = ObjectHelpers.copyObj(productTransferModal)
      return ObjectHelpers.assignSameFields(
        salesProductsModel,
        p.SalesOrderProduct
      )
    })
  }

  // get all the save state
  if (appStore.isPageExist(PageStateConst.SALES_ORDER_FORM)) {
    if (
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.pages[PageStateConst.SALES_ORDER_FORM].state
      )
    ) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        appStore.pages[PageStateConst.SALES_ORDER_FORM].state
      )
    }
  } else {
    setSalesOrderFormPageState()
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 * ================================================*/
watch(
  () => model.value.sales_order.has_delivery,
  (show) => {
    if (show) {
      model.value.delivery = ObjectHelpers.copyObj(deliveryDefaultModel)
    } else {
      model.value.delivery.use_customer_address = false
    }
  }
)

watch(
  () => deliveryFormState.hideBody,
  (hideBody) => {
    if (hideBody) {
      delete model.value.delivery
    }
  }
)

watch(
  () => model.value.delivery?.use_customer_address,
  (useCustomerAddress) => {
    if (useCustomerAddress) {
      const customer = customerStore.customers.find(
        (c) => c.id == model.value.sales_order.customer_id
      )
      if (customer) {
        model.value.delivery.address_id = customer.address_id
        populateAddress(customer.address)
      }
    } else {
      if (model.value.delivery) {
        model.value.delivery.address_id = null
        model.value.delivery.address = ObjectHelpers.copyObj(
          deliveryDefaultModel.address
        )
      }
    }
  }
)

watch(
  () => model.value.sales_order.customer_id,
  (customerId) => {
    if (
      customerId &&
      model.value.delivery?.use_customer_address &&
      model.value.sales_order.has_delivery
    ) {
      const customer = customerStore.customers.find((c) => c.id == customerId)
      if (customer) {
        model.value.delivery.address_id = customer.address_id
        populateAddress(customer.address)
      }
    }
  }
)

watch(
  () => model.value,
  () => {
    setSalesOrderFormPageState()
  },
  { deep: true }
)

// watch for the sales order products
watch(
  () => model.value.sales_order_products,
  () => {
    if (model.value.sales_order_products.length) {
      const amount = model.value.sales_order_products
        .filter((p) => p.total)
        .map((p) => parseFloat(p.total))

      const discount = model.value.sales_order_products
        .filter((p) => p.discount)
        .map((p) => parseFloat(p.discount))

      const subTotal = amount.length ? amount.reduce((a, b) => a + b) : 0.0
      const totalDiscount = discount.length
        ? discount.reduce((a, b) => a + b)
        : 0.0

      model.value.sales_order.sub_total = subTotal
      model.value.sales_order.total_discount = totalDiscount
      model.value.sales_order.total = subTotal - totalDiscount
    }
  },
  { deep: true }
)
</script>

<style scoped>
.delivery-info.show {
  animation: fade-in 0.5s ease-in-out forwards;
}

.delivery-info.hide {
  animation: fade-out 0.5s ease-in-out forwards;
}
</style>
