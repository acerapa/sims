<template>
  <div
    class="grid grid-cols-7 gap-3 gen-table-row min-w-[740px]"
    @click="$emit('view', props.fixAsset.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.fixAsset.id }}</p>
    </div>
    <p class="col-span-1 text-sm">{{ props.fixAsset.po_no }}</p>
    <p class="col-span-2 text-sm">{{ preparedByName }}</p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.fixAsset.when, 'YYYY/MM/DD') }}
    </p>
    <div class="col-span-1">
      <BadgeComponent
        :text="StockTransferStatusMap[props.fixAsset.status].text"
        :custom-class="StockTransferStatusMap[props.fixAsset.status].class"
      />
    </div>
  </div>
</template>

<script setup>
import { StockTransferStatusMap } from 'shared'
import BadgeComponent from '../shared/BadgeComponent.vue'
import { DateHelpers } from 'shared/helpers'
import { computed } from 'vue'
const props = defineProps({
  fixAsset: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])

const preparedByName = computed(() => {
  return `${props.fixAsset.process_by.first_name} ${props.fixAsset.process_by.last_name}`
})
</script>
