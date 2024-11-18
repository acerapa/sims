<template>
  <div
    class="grid grid-cols-4 gap-3 min-w-[935px] gen-table-row"
    @click="emit('view', props.inventory.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.inventory.id }}</p>
    </div>
    <p class="col-span-1 text-sm">
      {{ DateHelpers.formatDate(props.inventory.date_started, 'M/D/YYYY') }}
    </p>
    <div class="col-span-1 text-sm">
      <BadgeComponent
        :text="PhysicalInventoryStatusMap[props.inventory.status].text"
        :custom-class="PhysicalInventoryStatusMap[props.inventory.status].class"
      />
    </div>
    <p class="col-span-1 text-sm">
      {{
        props.inventory.date_ended
          ? DateHelpers.formatDate(props.inventory.date_ended, 'M/D/YYYY')
          : '-'
      }}
    </p>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared/helpers'
import BadgeComponent from '@/components/shared/BadgeComponent.vue'
import { PhysicalInventoryStatusMap } from 'shared/enums'

const props = defineProps({
  inventory: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
