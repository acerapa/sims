<template>
  <div class="grid grid-cols-10 gap-3 min-w-[907px]">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.product.id }}</p>
    </div>
    <p class="col-span-1 text-sm truncate" :title="props.product.name">
      {{ props.product.name }}
    </p>
    <p class="col-span-1 text-sm">{{ props.product.item_code }}</p>
    <p class="col-span-3 text-sm line-clamp-2">
      {{ props.product.purchase_description }}
    </p>
    <p class="col-span-1 text-sm">{{ props.product.quantity_in_stock }}</p>
    <p class="col-span-1 text-sm">
      {{ DateHelpers.formatDate(props.product.createdAt, 'M/D/YYYY') }}
    </p>
    <div class="col-span-1 text-sm flex">
      <button
        v-if="
          props.product.product_setting &&
          props.product.quantity_in_stock > props.product.product_setting.point
        "
        class="status text-sm bg-opacity-20 text-success bg-success flex-shrink-0"
      >
        In Stock
      </button>
      <button
        v-if="
          props.product.quantity_in_stock &&
          props.product.product_setting &&
          props.product.quantity_in_stock < props.product.product_setting.point
        "
        class="status text-sm bg-opacity-20 text-yellow-500 bg-yellow-500 flex-shrink-0"
      >
        Low Stock
      </button>
      <button
        v-if="props.product.quantity_in_stock <= 0"
        class="status text-sm bg-opacity-20 text-red-500 bg-red-500 flex-shrink-0"
      >
        Out of Stock
      </button>
    </div>
    <div class="col-span-1">
      <img
        src="@/assets/icons/vertical-menu.svg"
        alt=""
        class="cursor-pointer menu-btn-trigger"
        @click.stop="openMenu(props.product.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { DateHelpers } from 'shared/helpers/date'
const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['openMenu'])

const openMenu = () => {
  emit('openMenu', props.product.id)
}
</script>
