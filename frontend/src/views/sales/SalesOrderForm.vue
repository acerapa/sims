<template>
  <div class="cont flex flex-col gap-5">
    <div class="flex gap-3 max-lg:flex-col">
      <div class="flex flex-col gap-3 flex-1">
        <div class="flex justify-between items-center">
          <p class="font-semibold mb-1">Sales Order Information</p>
          <div class="flex gap-3">
            <SelectStatusDropdown
              v-model="model.sales_order.status"
              :status-map="SalesOrderStatusMap"
            />
            <button class="btn-green">Generate Invoice</button>
          </div>
        </div>

        <div class="flex gap-3">
          <CustomInput
            type="select"
            class="flex-1"
            :has-label="true"
            :has-add-new="true"
            name="customer_id"
            :error-has-text="true"
            label="Select Customer"
            :options="customerOptions"
            placeholder="Select Customer"
            @add-new="showCustomerModel = true"
            v-model="model.sales_order.customer_id"
            :error="errors.sales_order?.customer_id"
            :disabled="route.query.id ? true : false"
          />
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
            :error="errors.sales_order?.type"
          />
        </div>

        <div class="flex gap-3">
          <CustomInput
            type="date"
            class="flex-1"
            :has-label="true"
            name="purchase_date"
            label="Purchase Date"
            :error-has-text="true"
            v-model="model.sales_order.purchase_date"
            :error="errors.sales_order?.purchase_date"
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
            placeholder="Select Payment Method"
            @add-new="paymentMethodModal = true"
            v-model="model.sales_order.payment_method_id"
            :error="errors.sales_order?.payment_method_id"
          />
        </div>

        <CustomInput
          type="select"
          name="user_id"
          :has-label="true"
          :has-add-new="true"
          label="Prepared By"
          :error-has-text="true"
          placeholder="Prepared By"
          :options="employeeOptions"
          class="max-w-[calc(50%_-_6px)]"
          v-model="model.sales_order.user_id"
          @add-new="showEmployeeModal = true"
          :error="errors.sales_order?.user_id"
        />

        <CustomInput
          name="memo"
          label="Memo"
          type="textarea"
          :has-label="true"
          placeholder="Memo"
          :error-has-text="true"
          v-model="model.sales_order.memo"
          :error="errors.sales_order?.memo"
        />
      </div>
    </div>
  </div>

  <div class="cont">
    <div class="flex gap-3">
      <input
        id="has-deliery"
        type="checkbox"
        v-model="deliveryFormState.show"
        :change="
          deliveryFormState.show ? (deliveryFormState.hideBody = false) : ''
        "
      />
      <label for="has-delivery">Has Delivery?</label>
    </div>
    <div
      class="delivery-info"
      v-if="!deliveryFormState.hideBody"
      :class="deliveryFormState.show ? 'show' : 'hide'"
      @animationend="deliveryFormState.hideBody = !deliveryFormState.show"
    >
      <p class="font-semibold mt-3">
        Delivery Information <span class="italic font-thin">(Optional)</span>
      </p>
      <div class="flex gap-3 mt-3">
        <CustomInput
          type="date"
          class="flex-1"
          :has-label="true"
          label="Delivery Date"
          name="delivery_date"
          :error-has-text="true"
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
          :error="errors.delivery?.courier"
        />
      </div>

      <div class="mt-3 flex flex-col gap-1">
        <p class="text-sm font-semibold">Shipment Address</p>
        <AddressForm
          :has-label="true"
          v-model="model.delivery.address"
          :address-errors="errors.delivery?.address"
        />
      </div>
    </div>
  </div>

  <div class="cont">
    <p class="font-semibold">Select Products</p>
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
      ></MultiSelectTable>
    </div>

    <!-- buttons -->
    <div
      class="flex gap-3 mt-6"
      :class="route.query.id ? 'justify-between' : 'justify-end'"
    >
      <button
        class="btn-danger-outline"
        v-if="route.query.id"
        @click="showDeleteModal = true"
      >
        Delete
      </button>
      <div class="flex gap-3">
        <RouterLink :to="{ name: SalesConst.SALES }" class="btn-gray-outline">
          {{ isDisabled ? 'Back' : 'Cancel' }}
        </RouterLink>
        <button
          type="button"
          class="btn-outline"
          @click=""
          v-if="!route.query.id"
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
          v-if="route.query.id && !isDisabled"
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
import { useRoute, useRouter } from 'vue-router'
import { EventEnum } from '@/data/event'
import {
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

import { SalesConst } from '../../const/route.constants'
import { useCustomerStore } from '@/stores/customer'
import { useSalesStore } from '@/stores/sales'
import { ToastTypes } from '@/data/types'
import { usePaymentMethodStore } from '@/stores/payment-method'
import { useTableScroll } from '@/use/useTableScroll'
import { useEmployeeStore } from '@/stores/employee'
import { useValidation } from '@/composables/useValidation'

const route = useRoute()
const router = useRouter()

const isDisabled = ref(false)
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
const salesStore = useSalesStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const paymentMethodStore = usePaymentMethodStore()

const productTransferModal = {
  product_id: '',
  description: '',
  quantity: 0,
  price: 0,
  total: 0,
  discount: 0
}

const defaultModel = {
  sales_order: {
    memo: '',
    type: '',
    user_id: '',
    customer_id: '',
    purchase_date: '',
    payment_method_id: '',
    status: SalesOrderStatus.OPEN
  },
  sales_order_products: [{ ...productTransferModal }]
}

const deliveryDefaultModel = {
  delivery_date: new Date(),
  courier: '',
  address_id: '',
  address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  }
}

const model = ref(ObjectHelpers.copyObj(defaultModel))
const deliveryModel = ref(ObjectHelpers.copyObj(deliveryDefaultModel))

const modelErrors = ref({})

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

    router.push({
      name: SalesConst.SALES_ORDER
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${route.query.id ? 'update' : 'create'} Sales Order!`,
      type: ToastTypes.ERROR
    })
  }
}

const onAfterDelete = async () => {
  salesStore.removeSalesOrder(route.query.id)
  router.push({
    name: SalesConst.SALES_ORDER
  })
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

  if (route.query.id) {
    await salesStore.fetchSalesOrder(route.query.id)

    model.value.sales_order = ObjectHelpers.assignSameFields(
      model.value.sales_order,
      salesStore.salesOrder
    )

    // few dates patches
    model.value.sales_order.purchase_date = salesStore.salesOrder.purchase_date
      ? new Date(salesStore.salesOrder.purchase_date)
          .toISOString()
          .split('T')[0]
      : ''
    model.value.sales_order.bill_due = salesStore.salesOrder.bill_due
      ? new Date(salesStore.salesOrder.bill_due).toISOString().split('T')[0]
      : ''
    model.value.sales_order.delivery_date = salesStore.salesOrder.delivery_date
      ? new Date(salesStore.salesOrder.delivery_date)
          .toISOString()
          .split('T')[0]
      : ''

    // delivery
    if (salesStore.salesOrder.delivery) {
      deliveryFormState.show = true
      deliveryFormState.hideBody = false
      model.value.delivery = ObjectHelpers.assignSameFields(
        deliveryDefaultModel,
        salesStore.salesOrder.delivery
      )
    }

    // products
    model.value.sales_order_products = salesStore.salesOrder.products.map(
      (p) => {
        let salesProductsModel = ObjectHelpers.copyObj(productTransferModal)
        return ObjectHelpers.assignSameFields(
          salesProductsModel,
          p.SalesOrderProduct
        )
      }
    )
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

/** ================================================
 * WATCHERS
 * ================================================*/
watch(
  () => deliveryFormState.show,
  (show) => {
    if (show) {
      model.value.delivery = ObjectHelpers.copyObj(deliveryDefaultModel)
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
</script>

<style scoped>
.delivery-info.show {
  animation: fade-in 0.5s ease-in-out forwards;
}

.delivery-info.hide {
  animation: fade-out 0.5s ease-in-out forwards;
}
</style>
