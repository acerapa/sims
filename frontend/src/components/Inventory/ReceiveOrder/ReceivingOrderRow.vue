<template>
  <div class="grid grid-cols-9 gap-3 min-w-[1106px]">
    <p class="col-span-2 text-sm">{{ product.name }}</p>
    <p class="col-span-1 text-sm">{{ product.cost }}</p>
    <p class="col-span-1 text-sm">{{ product.quantity }}</p>
    <p class="col-span-1 text-sm">{{ product.amount }}</p>
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
import { ProductOrderedStatus } from 'shared'

const product = defineModel()

const productOrderStatusOptions = [
  {
    text: 'Open',
    value: ProductOrderedStatus.OPEN
  },
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
</script>
