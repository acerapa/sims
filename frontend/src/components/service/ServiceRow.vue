<template>
  <div
    class="grid grid-cols-10 gap-3 min-w-[907px] gen-table-row"
    @click="emit('view', props.service.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.service.id }}</p>
    </div>
    <p class="col-span-2 text-sm truncate">
      {{ props.service.name }}
    </p>
    <p class="col-span-4 text-sm">
      {{ props.service.service_details.description }}
    </p>
    <p class="col-span-1 text-end pr-3">
      {{ parseFloat(props.service.price).toFixed(2) }}
    </p>
    <p class="col-span-2 text-center">
      {{
        new Date(props.service.createdAt).toLocaleString('default', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  service: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
