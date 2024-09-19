<template>
  <div class="grid grid-cols-10 gap-3 gen-table-row !py-0 !pl-10">
    <div class="col-span-2 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="hasCheckBox" />
      <p class="text-sm">{{ props.item.id }}</p>
    </div>
    <p class="col-span-4 text-sm py-2">{{ props.item.product.name }}</p>
    <p class="col-span-2 text-sm py-2">
      {{ props.item.product.quantity_in_stock }}
    </p>
    <div class="col-span-2">
      <CustomInput
        type="number"
        name="quantity"
        :id="`quantity-${props.item.id}`"
        v-model="model.physical_quantity"
        placeholder="Quantity"
        input-class="bg-transparent"
        @change="onQuantityChange"
        :disabled="physicalInventory.status == PhysicalInventoryStatus.DONE"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomInput from "../shared/CustomInput.vue";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import { PhysicalInventoryStatus } from "shared/enums/purchase-order";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  hasCheckBox: {
    type: Boolean,
  },
});

const model = ref({
  physical_quantity: props.item.physical_quantity,
});

const physicalInventoryStore = usePhysicalInventoryStore();
const physicalInventory = physicalInventoryStore.physicalInventory;

/** ================================================
 * EVENTS
 ** ================================================*/

/** ================================================
 * METHODS
 ** ================================================*/
const onQuantityChange = async () => {
  if (model.value.physical_quantity != props.item.physical_quantity) {
    await physicalInventoryStore.updateItem(props.item.id, model.value);
    await physicalInventoryStore.getGroupedItems(physicalInventory.id);
  }
};
</script>
