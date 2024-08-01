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
      {{ DateHelpers.formatDate(props.order.date, "M/D/YYYY") }}
    </p>
    <p class="col-span-2 text-sm">
      {{ DateHelpers.formatDate(props.order.bill_due, "M/D/YYYY") }}
    </p>
    <div class="col-span-1">
      <BadgeComponent
        :custom-class="selectedStatus.class"
        :text="selectedStatus.text"
      />
    </div>
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
import { DateHelpers } from "shared/helpers/date";
import { PurchaseOrderStatus } from "shared";
import BadgeComponent from "../shared/BadgeComponent.vue";

const emit = defineEmits(["openMenu"]);

const props = defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
});

const PurchaseStatusMap = Object.freeze({
  [PurchaseOrderStatus.OPEN]: {
    text: "Open",
    class: "bg-blue-500 text-blue-500",
  },
  [PurchaseOrderStatus.CONFIRMED]: {
    text: "Confirmed",
    class: "bg-yellow-500 text-yellow-500",
  },
  [PurchaseOrderStatus.COMPLETED]: {
    text: "Completed",
    class: "bg-success text-success",
  },
  [PurchaseOrderStatus.CANCELLED]: {
    text: "Cancelled",
    class: "bg-gray-500 text-gray-500",
  },
});

const selectedStatus = PurchaseStatusMap[props.order.status];
</script>
