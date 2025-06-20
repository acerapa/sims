<template>
  <div
    class="grid grid-cols-5 gap-3 items-start min-w-[430px] gen-table-row"
    @click="emit('view', props.productReordering.id)"
  >
    <div class="col-span-2 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="props.hasCheckBox" />
      <p class="text-sm">{{ props.productReordering.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.productReordering.point }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  productReordering: {
    type: Object,
    default: () => ({})
  },
  hasCheckBox: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view'])
</script>
