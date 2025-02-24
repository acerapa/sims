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
            :error="modelErrors.cusstomer_id"
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
          />
        </div>

        <div class="flex gap-3">
          <CustomInput
            type="date"
            class="flex-1"
            :has-label="true"
            name="purchase_date"
            label="Purchase Date"
            v-model="model.sales_order.date_purchase"
          />
          <CustomInput
            type="date"
            class="flex-1"
            :has-label="true"
            name="bill_due"
            label="Bill Due"
            v-model="model.bill_due"
          />
        </div>
        <CustomInput
          name="memo"
          label="Memo"
          type="textarea"
          :has-label="true"
          placeholder="Memo"
          v-model="model.memo"
        />
      </div>
      <div class="flex-1">
        <p class="font-semibold mb-4">Shipment Address</p>
        <AddressForm
          :has-label="true"
          class="flex-1"
          v-model="model.shipment_address"
        />
      </div>
    </div>

    <p class="font-semibold">Select Products</p>
    <MultiSelectTable
      :header-component="SalesOrderFormHeader"
      :row-component="SalesOrderFormRow"
      v-model="model.sales_order_products"
      :format="{ ...productTransferModal }"
      :row-props="{
        selected: model.sales_order_products
      }"
    ></MultiSelectTable>

    <!-- buttons -->
    <div
      class="flex gap-3 mt-6"
      :class="route.query.id ? 'justify-between' : 'justify-end'"
    >
      <button class="btn-danger-outline" v-if="route.query.id">Delete</button>
      <div class="flex gap-3">
        <RouterLink :to="{ name: SalesConst.SALES }" class="btn-gray-outline">
          {{ isDisabled ? 'Back' : 'Cancel' }}
        </RouterLink>
        <button type="button" class="btn-outline" @click="" v-if="!isEdit">
          Save and New
        </button>
        <button type="button" class="btn" @click="" v-if="!isEdit">Save</button>

        <!-- edit page save button -->
        <button
          type="button"
          class="btn"
          v-if="isEdit && !isDisabled"
          @click=""
        >
          Update
        </button>
      </div>
    </div>
  </div>
  <CustomerModal v-if="showCustomerModel" v-model="showCustomerModel" />
</template>

<script setup>
import Event from '@/event'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EventEnum } from '@/data/event'
import { SalesOrderType } from 'shared'
import AddressForm from '@/components/shared/AddressForm.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'
import SalesOrderFormRow from '@/components/sales/SalesOrderFormRow.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'
import SalesOrderFormHeader from '@/components/sales/SalesOrderFormHeader.vue'
import { SalesConst } from '../../const/route.constants'
import { useCustomerStore } from '@/stores/customer'

const route = useRoute()

const showCustomerModel = ref(false)
const isEdit = ref(false)
const isDisabled = ref(false)

const customerStore = useCustomerStore()

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
    reference_no: '',
    memo: '',
    date_purchase: '',
    bill_due: '',
    discount: 0
  },
  shipment_address: {
    address1: '',
    address2: '',
    city: '',
    postal: ''
  },
  sales_order_products: [{ ...productTransferModal }]
}

const model = ref({ ...defaultModel })
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

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async (saveAndNew) => {}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await customerStore.getCustomers()

  if (route.query.id) {
    // code ...
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
