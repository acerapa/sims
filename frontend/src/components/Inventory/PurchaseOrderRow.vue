<template>
  <div class="grid grid-cols-12 gap-3">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.order.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ props.order.ref_no }}</p>
    <p class="col-span-2 text-sm">{{ props.order.supplier.company_name }}</p>
    <p class="col-span-1 text-sm">{{ props.order.amount }}</p>
    <p class="col-span-2 text-sm">
      {{ Helpers.formatDate(props.order.date, "M/D/YYYY") }}
    </p>
    <p class="col-span-2 text-sm">
      {{ Helpers.formatDate(props.order.bill_due, "M/D/YYYY") }}
    </p>
    <p class="col-span-1 text-sm">{{ props.order.status }}</p>
    <div class="col-span-1 text-sm">
      <img
        @click.stop="emit('openMenu', props.order.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { Helpers } from "@/helpers/index";

const emit = defineEmits(["openMenu"]);

const props = defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
});
</script>
