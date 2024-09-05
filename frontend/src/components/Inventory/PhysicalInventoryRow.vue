<template>
  <div class="grid grid-cols-6 gap-3 min-w-[935px] gen-table-row">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.inventory.id }}</p>
    </div>
    <p class="col-span-1 text-sm">
      {{ DateHelpers.formatDate(props.inventory.date, "M/D/YYYY") }}
    </p>
    <p class="col-span-2 text-sm">{{ props.inventory.remarks }}</p>
    <div class="col-span-1 text-sm">
      <BadgeComponent
        :text="PhysicalInventoryStatusMap[props.inventory.status].text"
        :custom-class="PhysicalInventoryStatusMap[props.inventory.status].class"
      />
    </div>
    <div class="col-span-1 text-sm">
      <img
        @click.stop="openMenu(props.inventory.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { DateHelpers } from "shared/helpers";
import BadgeComponent from "@/components/shared/BadgeComponent.vue";
import { PhysicalInventoryStatusMap } from "shared/enums/purchase-order";

const props = defineProps({
  inventory: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["openMenu"]);

const openMenu = () => {
  emit("openMenu", props.inventory.id);
};
</script>
