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
      <p
        class="col-span-1 text-sm group-last:font-semibold"
        :class="[
          props.product.name.toLowerCase().includes('total')
            ? 'text-blue-500'
            : '',
        ]"
      >
        {{ props.product.available }}
      </p>
      <div class="flex items-center pl-6">
        <img
          class="col-span-1 w-4 h-4"
          :src="check"
          v-if="props.product.ordered"
          alt=""
        />
      </div>
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
import check from "@/assets/icons/check-mark.png";
const props = defineProps({
  product: {
    type: Object,
    default: () => ({}),
  },
});
</script>
