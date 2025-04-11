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
      v-model="product.quantity_received"
    />
    <CustomInput
      :rows="1"
      class="col-span-2"
      type="textarea"
      name="remarks"
      placeholder="Remarks"
      v-model="product.remarks"
    />
    <CustomInput
      type="select"
      name="status"
      v-model="product.status"
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
import { computed } from 'vue'

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
  }
]

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
</script>
