<template>
  <div class="grid grid-cols-7 gap-3 items-center">
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
    <div class="col-span-1 text-sm">
      <img
        @click.stop="openMenu(props.supplier.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  supplier: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['openMenu'])

const openMenu = (id) => {
  emit('openMenu', id)
}
</script>
