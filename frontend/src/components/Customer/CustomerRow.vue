<template>
  <div
    class="grid grid-cols-8 gap-3 items-center min-w-[888px] gen-table-row"
    @click="emit('view', props.customer.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="props.hasCheckBox" />
      <p class="text-sm">{{ props.customer.id }}</p>
    </div>
    <p class="text-sm col-span-2">
      {{ `${props.customer.first_name} ${props.customer.last_name}` }}
    </p>
    <p class="text-sm col-span-4 line-clamp-1">{{ concatenatedAddress }}</p>
    <p class="text-sm col-span-1">{{ props.customer.phone_number }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  customer: {
    type: Object,
    default: () => ({})
  },
  hasCheckBox: {
    type: Boolean,
    default: false
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const concatenatedAddress = computed(
  () =>
    `${props.customer.address.address1}, ${props.customer.address.address2}, ${props.customer.address.city}, ${props.customer.address.postal}`
)

const emit = defineEmits(['view'])
</script>
