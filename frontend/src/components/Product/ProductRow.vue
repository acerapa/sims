<template>
  <div
    class="grid grid-cols-9 gap-3 min-w-[907px] gen-table-row"
    @click="emit('view', props.product.id)"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.product.id }}</p>
    </div>
    <p class="col-span-3 text-sm truncate" :title="props.product.name">
      {{ props.product.name }}
    </p>
    <p class="col-span-1 text-sm">
      {{ props.product.product_details.item_code }}
    </p>
    <p class="col-span-1 text-sm text-end">
      {{ props.product.price }}
    </p>
    <p class="col-span-1 text-sm text-end pr-2">
      {{ props.product.product_details.stock }}
    </p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.product.createdAt).toLocaleString('default', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }}
    </p>
    <div class="col-span-1 text-sm flex">
      <button
        v-if="
          props.product.product_details.product_setting &&
          props.product.product_details.stock >
            props.product.product_details.product_setting.point
        "
        class="status text-sm bg-opacity-20 text-success bg-success flex-shrink-0"
      >
        In Stock
      </button>
      <button
        v-if="
          props.product.product_details.stock &&
          props.product.product_details.product_setting &&
          props.product.product_details.stock <
            props.product.product_details.product_setting.point
        "
        class="status text-sm bg-opacity-20 text-yellow-500 bg-yellow-500 flex-shrink-0"
      >
        Low Stock
      </button>
      <button
        v-if="props.product.product_details.stock <= 0"
        class="status text-sm bg-opacity-20 text-red-500 bg-red-500 flex-shrink-0"
      >
        Out of Stock
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
