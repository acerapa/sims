<template>
  <div class="grid grid-cols-7 items-center gap-3 min-w-[1150px] gen-table-row">
    <p class="col-span-2 text-sm">{{ model.category }}</p>
    <p class="col-span-2 text-sm">{{ model.name }}</p>
    <p class="col-span-1 text-sm">{{ model.current_quantity }}</p>
    <CustomInput
      type="number"
      name="new_quantity"
      placeholder="Ex. 0"
      class="col-span-1 text-sm"
      v-model="model.new_quantity"
    />
    <CustomInput
      type="number"
      placeholder="Ex. 0"
      name="difference_quantity"
      class="col-span-1 text-sm"
      v-model="model.difference_quantity"
    />
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'

const model = defineModel({})
console.log(model.value)
</script>
