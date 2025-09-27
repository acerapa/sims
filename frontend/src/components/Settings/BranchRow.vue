<template>
  <div
    class="grid grid-cols-9 gap-3 gen-table-row min-w-[940px]"
    @click.stop="viewRow(props.branch.id)"
  >
    <div class="col-span-1 flex gap-3 items-center h-fit">
      <input type="checkbox" class="input" v-if="props.hasCheckBox" />
      <p class="text-sm">{{ props.branch.id }}</p>
    </div>
    <p class="col-span-2 text-sm">
      {{ props.branch.name }}
      <span v-if="props.branch.is_current" class="badge-outline">current</span>
    </p>
    <p class="col-span-3 text-sm">{{ concatenatedAddress }}</p>
    <p class="col-span-2 text-sm">{{ managerName }}</p>
    <div class="col-span-1 text-sm">
      <BadgeComponent
        :custom-class="BranchStatusMap[props.branch.status].class"
        :text="props.branch.status"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BranchStatusMap } from 'shared/enums'
import BadgeComponent from '../shared/BadgeComponent.vue'

const props = defineProps({
  branch: {
    type: Object,
    default: () => ({})
  },
  hasCheckBox: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view'])

/** ================================================
 * COMPUTED
 ** ================================================*/
const concatenatedAddress = computed(
  () =>
    `${props.branch.address.address1}, ${props.branch.address.address2}, ${props.branch.address.city}, ${props.branch.address.postal}`
)

const managerName = computed(
  () => `${props.branch.manager.first_name} ${props.branch.manager.last_name}`
)

/** ================================================
 * METHODS
 ** ================================================*/
const viewRow = (id) => {
  emit('view', id)
}
</script>

<style scoped>
.badge-outline {
  @apply leading-none !text-success border border-success px-1 rounded-md text-xs;
}
</style>
