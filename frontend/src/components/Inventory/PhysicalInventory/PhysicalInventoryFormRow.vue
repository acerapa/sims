<template>
  <div class="grid grid-cols-7 gap-3 gen-table-row items-center">
    <p
      class="col-span-1 text-sm text-nowrap overflow-hidden text-ellipsis"
      :title="model.category"
    >
      {{ model.category }}
    </p>
    <p class="col-span-2 text-sm" :title="model.name">
      {{ model.name }}
    </p>
    <p
      class="col-span-2 text-sm text-nowrap overflow-hidden text-ellipsis"
      :title="model.suppliers"
    >
      {{ model.suppliers }}
    </p>
    <p class="col-span-1 text-sm pl-5" :title="model.quantity">
      {{ model.quantity }}
    </p>
    <CustomInput
      placeholder="Ex. 1"
      class="col-span-1"
      type="number"
      name="physical_count"
    />
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})

const model = defineModel()
</script>
