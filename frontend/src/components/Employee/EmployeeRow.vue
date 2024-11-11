<template>
  <div
    class="grid grid-cols-12 gap-3 items-center min-w-[792px] gen-table-row"
    @click="emit('view', props.user.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ user.id }}</p>
    </div>
    <p class="col-span-2 text-sm">
      {{ `${user.first_name} ${user.last_name}` }}
    </p>
    <p class="col-span-2 text-sm">Branch 1</p>
    <p class="col-span-2 text-sm">{{ user.position }}</p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(user.date_started, 'M/D/YYYY') }}
    </p>
    <p class="col-span-2 text-sm">
      {{
        user.date_ended
          ? DateHelpers.formatDate(user.date_ended, 'M/D/YYYY')
          : '-'
      }}
    </p>
    <p class="col-span-1 text-sm">
      <button
        class="status bg-opacity-20"
        :class="
          user.status ? 'text-success bg-success' : 'text-gray-500 bg-gray-500'
        "
      >
        {{ user.status ? 'Active' : 'Inactive' }}
      </button>
    </p>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
