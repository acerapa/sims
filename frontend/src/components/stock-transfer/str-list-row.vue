<template>
  <div
    class="grid grid-cols-8 gap-3 gen-table-row min-w-[1048px]"
    @click="emit('view', props.str.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="props.hasCheckBox" />
      <p class="text-sm">{{ props.str.id }}</p>
    </div>
    <p class="col-span-2 text-sm truncate">{{ props.str.receiver.name }}</p>
    <p class="col-span-1 text-sm truncate">{{ managerName }}</p>
    <p class="col-span-1 text-sm truncate">{{ processByName }}</p>
    <p class="col-span-2 text-sm truncate">
      {{ DateHelpers.formatDate(props.str.when, 'MM/DD/YYYY HH:II a') }}
    </p>
    <p class="col-span-1 text-sm truncate">
      <BadgeComponent
        :custom-class="selectedStatus.class"
        :text="selectedStatus.text"
      />
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DateHelpers } from 'shared/helpers'
import BadgeComponent from '../shared/BadgeComponent.vue'
import { StockTransferStatusMap } from 'shared'

const emit = defineEmits(['view'])
const props = defineProps({
  str: {
    type: Object,
    default: () => ({})
  },
  hasCheckBox: {
    type: Boolean,
    default: false
  }
})

const managerName = computed(() => {
  const { receiver } = props.str
  return `${receiver.manager.first_name} ${receiver.manager.last_name}`
})

const processByName = computed(() => {
  const { process_by } = props.str
  return `${process_by.first_name} ${process_by.last_name}`
})

const selectedStatus = StockTransferStatusMap[props.str.status]
</script>
