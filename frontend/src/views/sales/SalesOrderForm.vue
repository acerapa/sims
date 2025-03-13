<template>
  <div class="cont flex flex-col gap-5">
    <div class="flex gap-3 max-lg:flex-col">
      <div class="flex flex-col gap-3 flex-1">
        <p class="font-semibold mb-1">Sales Order Information</p>
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
            :error="modelErrors.customer_id"
            v-model="model.sales_order.customer_id"
            @add-new="showCustomerModel = true"
          />
          <CustomInput
            type="select"
            class="flex-1"
            :options="[
              {
                text: 'Cash',
                value: SalesOrderType.CASH
              },
              {
                text: 'Installment',
                value: SalesOrderType.INSTALLMENT
              }
            ]"
            :has-label="true"
            name="customer_id"
            label="Order Type"
            v-model="model.sales_order.type"
            placeholder="Order Type"
            :error-has-text="true"
            :error="modelErrors.type"
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
            :error="modelErrors.purchase_date"
            v-model="model.sales_order.purchase_date"
          />
          <CustomInput
            type="date"
            class="flex-1"
            :has-label="true"
            name="bill_due"
            label="Bill Due"
            :error-has-text="true"
            :error="modelErrors.bill_due"
            v-model="model.sales_order.bill_due"
          />
        </div>
        <div class="flex gap-3">
          <CustomInput
            type="date"
            class="flex-1"
            :has-label="true"
            name="delivery_date"
            label="Delivery Date"
            :error-has-text="true"
            :error="modelErrors.delivery_date"
            v-model="model.sales_order.delivery_date"
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
            :error="modelErrors.payment_method_id"
            v-model="model.sales_order.payment_method_id"
          />
        </div>
        <CustomInput
          name="memo"
          label="Memo"
          type="textarea"
          :has-label="true"
          placeholder="Memo"
          :error-has-text="true"
          :error="modelErrors.memo"
          v-model="model.sales_order.memo"
        />
      </div>
      <div class="flex-1">
        <p class="font-semibold mb-4">Shipment Address</p>
        <AddressForm
          :has-label="true"
          class="flex-1"
          v-model="model.shipment_address"
          :address-errors="modelErrors.shipment_address"
        />
      </div>
    </div>

    <p class="font-semibold">Select Products</p>
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
  <DeleteConfirmModal
    v-if="showDeleteModal && route.query.id"
    v-model="showDeleteModal"
    :href="`sales-order/${route.query.id}`"
    @after-delete="onAfterDelete"
  />
</template>

<script setup>
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EventEnum } from '@/data/event'
import { ObjectHelpers, SalesOrderCreateSchema, SalesOrderType } from 'shared'
import AddressForm from '@/components/shared/AddressForm.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import SalesOrderFormRow from '@/components/sales/SalesOrderFormRow.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import SalesOrderFormHeader from '@/components/sales/SalesOrderFormHeader.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import PaymentMethodModal from '@/components/sales/payment-method/PaymentMethodModal.vue'
import { SalesConst } from '../../const/route.constants'
import { useCustomerStore } from '@/stores/customer'
import { useSalesStore } from '@/stores/sales'
import { ToastTypes } from '@/data/types'
import { usePaymentMethodStore } from '@/stores/payment-method'

const route = useRoute()
const router = useRouter()

const isDisabled = ref(false)
const showDeleteModal = ref(false)
const showCustomerModel = ref(false)
const paymentMethodModal = ref(false)
const rowEventName = 'sales-order-row-event'

const salesStore = useSalesStore()
const customerStore = useCustomerStore()
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
    customer_id: '',
    type: '',
    memo: '',
    purchase_date: '',
    delivery_date: '',
    bill_due: '',
    status: 'open',
    payment_method_id: ''
  },
  shipment_address: {
    address1: '',
    address2: '',
    city: '',
    province: '',
    postal: ''
  },
  sales_order_products: [{ ...productTransferModal }]
}

const model = ref(ObjectHelpers.copyObj(defaultModel))
const modelErrors = ref({})
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

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async (saveAndNew) => {
  // validation
  modelErrors.value = {}
  Event.emit(rowEventName, modelErrors.value.sales_order_products)

  const { error } = SalesOrderCreateSchema.validate(model.value, {
    abortEarly: false
  })

  if (error) {
    error.details.forEach((err) => {
      if (err.path.includes('sales_order_products')) {
        if (
          modelErrors.value[err.path[0]] &&
          Object.keys(modelErrors.value[err.path[0]]).length
        ) {
          modelErrors.value[err.path[0]] = {
            ...modelErrors.value[err.path[0]],
            [err.context.key]: err.message.replace(/"[^"]*"/g, err.context.key)
          }
        } else {
          modelErrors.value[err.path[0]] = {
            [err.context.key]: err.message.replace(/"[^"]*"/g, err.context.key)
          }
        }
      } else if (err.path.includes('shipment_address')) {
        if (
          modelErrors.value[err.path[0]] &&
          Object.keys(modelErrors.value[err.path[0]])
        ) {
          modelErrors.value[err.path[0]] = {
            ...modelErrors.value[err.path[0]],
            [err.path[1]]: err.message.replace(/"[^"]*"/g, err.context.key)
          }
        } else {
          modelErrors.value[err.path[0]] = {
            [err.path[1]]: err.message.replace(/"[^"]*"/g, err.context.key)
          }
        }
      } else {
        modelErrors.value[err.context.key] = err.message.replace(
          /"[^"]*"/g,
          err.context.key
        )
      }
    })

    // trigger event to show errors in the products selection table
    Event.emit(rowEventName, modelErrors.value.sales_order_products)
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
onMounted(async () => {
  await customerStore.getCustomers()
  await paymentMethodStore.getPaymentMethods()

  if (route.query.id) {
    await salesStore.getSalesOrder(route.query.id)

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

    // address
    model.value.shipment_address = ObjectHelpers.assignSameFields(
      model.value.shipment_address,
      salesStore.salesOrder.shipment_address
    )

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
</script>
