<template>
  <div class="cont flex flex-col gap-5">
    <div class="flex gap-3">
      <div class="flex flex-col gap-3 flex-1">
        <p class="font-semibold mb-1">Sales Order Information</p>
        <CustomInput
          type="select"
          :options="[]"
          :has-label="true"
          :has-add-new="true"
          name="customer_id"
          label="Select Customer"
          v-model="model.customer_id"
          placeholder="Select Customer"
          @add-new="showCustomerModel = true"
        />

        <div class="flex gap-3">
          <CustomInput
            type="date"
            class="flex-1"
            :has-label="true"
            name="order_date"
            label="Order Date"
            v-model="model.date_purchases"
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
  </div>
  <CustomerModal v-if="showCustomerModel" v-model="showCustomerModel" />
</template>

<script setup>
import Event from '@/event'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EventEnum } from '@/data/event'
import AddressForm from '@/components/shared/AddressForm.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomerModal from '@/components/Customer/CustomerModal.vue'

const route = useRoute()

const showCustomerModel = ref(false)

const productTransferModal = {}

const defaultModel = {
  customer_id: '',
  type: '',
  shipment_address: {
    address1: '',
    address2: '',
    city: '',
    postal: ''
  },
  reference_no: '',
  memo: '',
  date_purchases: '',
  bill_due: '',
  discount: 0,
  products: [{ ...productTransferModal }]
}

const model = ref({ ...defaultModel })
/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

onMounted(() => {
  if (route.query.id) {
    // code ...
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
