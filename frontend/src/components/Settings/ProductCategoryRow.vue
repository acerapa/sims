<template>
  <div
    class="grid grid-cols-6 gap-3 min-w-[550px] gen-table-row"
    @click="emit('view', props.productCategory.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.productCategory.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.productCategory.name }}</p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.productCategory.createdAt, 'M/D/YYYY') }}
    </p>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared'

const props = defineProps({
  productCategory: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
