<template>
  <div class="grid grid-cols-7 gap-3 gen-table-row">
    <p
      class="col-span-1 text-sm text-nowrap overflow-hidden"
      :title="props.product.category"
    >
      {{ props.product.category }}
    </p>
    <p class="col-span-2 text-sm" :title="props.product.name">
      {{ props.product.name }}
    </p>
    <p class="col-span-2 text-sm" :title="props.product.suppliers">
      {{ props.product.suppliers }}
    </p>
    <p class="col-span-1 text-sm" :title="props.product.quantity">
      {{ props.product.quantity }}
    </p>
    <CustomInput
      placeholder="Ex. 1"
      class="col-span-1"
      type="number"
      name="physical_count"
    />
  </div>
  e
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})
</script>
