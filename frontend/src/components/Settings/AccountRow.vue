<template>
  <div
    class="grid grid-cols-8 gap-3 gen-table-row min-w-[495px]"
    @click="emit('view', props.account.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.account.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.account.name }}</p>
    <p class="col-span-2 text-sm">{{ props.account.type }}</p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.account.createdAt, 'M/D/YYYY') }}
    </p>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared'
const emit = defineEmits(['view'])
const props = defineProps({
  account: {
    type: Object,
    default: () => ({})
  }
})
</script>
