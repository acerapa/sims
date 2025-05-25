<template>
  <div
    class="grid grid-cols-9 gap-3 min-w-[1106px]"
    v-if="purchaseProductDetails"
  >
    <p class="col-span-2 text-sm">{{ purchaseProductDetails.name }}</p>
    <p class="col-span-1 text-sm">{{ purchaseProductDetails.cost }}</p>
    <p class="col-span-1 text-sm">{{ purchaseProductDetails.quantity }}</p>
    <p class="col-span-1 text-sm">{{ purchaseProductDetails.amount }}</p>
    <CustomInput
      class="col-span-1"
      type="number"
      name="quantity-received"
      :disabled="props.isDisabled"
      v-model="product.quantity_received"
    />
    <CustomInput
      :rows="1"
      class="col-span-2"
      type="textarea"
      name="remarks"
      placeholder="Remarks"
      :disabled="props.isDisabled"
      v-model="product.remarks"
    />
    <CustomInput
      type="select"
      name="status"
      :error-has-text="true"
      :error="errors.status"
      v-model="product.status"
      :disabled="props.isDisabled"
      class="w-full [&>select]:w-full"
      :options="productOrderStatusOptions"
      placeholder="Select Ordered Product Status"
    />
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
import { storeToRefs } from 'pinia'
import { ProductOrderedStatus } from 'shared'
import { computed, onMounted, ref, watch } from 'vue'
import Event from '@/event'

const purchaseOrderStore = usePurchaseOrderStore()
const { purchaseOrder } = storeToRefs(purchaseOrderStore)

const product = defineModel()

const productOrderStatusOptions = [
  {
    text: 'Complete',
    value: ProductOrderedStatus.COMPLETE
  },
  {
    text: 'Incomplete',
    value: ProductOrderedStatus.INCOMPLETE
  },
  {
    text: 'Not Received',
    value: ProductOrderedStatus.NOT_RECEIVED
  },
  {
    text: 'Surplus',
    value: ProductOrderedStatus.SURPLUS
  }
]

const props = defineProps({
  ndx: {
    type: Number
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  eventName: {
    type: String,
    required: false
  }
})

const errors = ref({})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(props.eventName, (data) => {
  if (typeof props.ndx != 'undefined') {
    errors.value = data[props.ndx] ? data[props.ndx] : {}
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
/**
 * Computes details of a specific purchase product from the current purchase order
 * @returns {Object} Purchase product details including name and purchase order product properties
 */
const purchaseProductDetails = computed(() => {
  const purchaseProduct = purchaseOrder.value?.products.find(
    (p) => p.PurchaseOrderProducts.id == product.value.id
  )
  return {
    name: purchaseProduct?.product_details.purchase_description,
    ...purchaseProduct?.PurchaseOrderProducts
  }
})

const fillStatus = () => {
  const quantityReceived = parseFloat(product.value.quantity_received)
  const quantityOrdered = parseFloat(purchaseProductDetails.value.quantity)
  if (quantityReceived > quantityOrdered) {
    product.value.status = ProductOrderedStatus.SURPLUS
  } else if (quantityReceived < quantityOrdered) {
    product.value.status = ProductOrderedStatus.INCOMPLETE
  } else {
    product.value.status = ProductOrderedStatus.COMPLETE
  }
}

onMounted(() => {
  fillStatus()
})

// Auto-fill status
watch(
  () => product.value.quantity_received,
  () => fillStatus()
)
</script>
