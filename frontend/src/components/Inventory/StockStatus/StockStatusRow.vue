<template>
  <div
    class="grid grid-cols-10 gap-3 pl-20 last:!pl-0 group last:border-t last:border-black last:pt-2"
  >
    <p class="col-span-4 text-sm group-last:font-semibold">
      {{ props.product.name }}
    </p>
    <div class="col-span-6 grid grid-cols-6 gap-3 group-last:pl-12">
      <p class="col-span-1 text-sm group-last:font-semibold">
        {{ props.product.on_hand }}
      </p>
      <p class="col-span-1 text-sm group-last:font-semibold">
        {{ props.product.on_sale }}
      </p>
      <p class="col-span-1 text-sm group-last:font-semibold">
        {{ props.product.available }}
      </p>
      <p class="col-span-1 text-sm group-last:font-semibold">
        {{ props.product.ordered }}
      </p>
      <p class="col-span-1 text-sm group-last:font-semibold">
        {{ props.product.on_po }}
      </p>
      <p class="col-span-1 text-sm group-last:font-semibold">
        {{ props.product.next_delivery }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});
</script>
