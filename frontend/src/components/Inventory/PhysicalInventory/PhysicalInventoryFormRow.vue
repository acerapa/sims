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
      type="number"
      class="col-span-1"
      placeholder="Ex. 1"
      name="physical_count"
      :disabled="props.disabled"
      v-model="model.physical_quantity"
      :input-class="props.disabled ? '!bg-transparent' : ''"
    />
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const model = defineModel()
</script>
