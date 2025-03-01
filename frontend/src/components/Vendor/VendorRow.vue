<template>
  <div
    class="grid grid-cols-6 gap-3 items-center min-w-[564px] gen-table-row"
    @click="emit('view', props.supplier.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.supplier.id }}</p>
    </div>
    <p class="col-span-3 text-sm truncate">{{ props.supplier.company_name }}</p>
    <p class="col-span-2 text-sm truncate">
      {{
        `${props.supplier.annotation ? props.supplier.annotation : ''} ${props.supplier.first_name} ${props.supplier.last_name}`
      }}
    </p>
  </div>
</template>
<script setup>
const props = defineProps({
  supplier: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
