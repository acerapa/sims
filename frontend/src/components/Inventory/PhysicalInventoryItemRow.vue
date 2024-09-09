<template>
  <div class="grid grid-cols-11 gap-3 min-w-[1032px] gen-table-row">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="hasCheckBox" />
      <p class="text-sm">{{ props.item.id }}</p>
    </div>
    <p class="col-span-2 text-sm py-2">{{ props.item.name }}</p>
    <p class="col-span-2 text-sm py-2">{{ props.item.item_description }}</p>
    <p class="col-span-1 text-sm py-2">{{ props.item.quantity }}</p>
    <div class="col-span-1">
      <BadgeComponent
        :text="props.item.is_done ? 'Checked' : 'Unchecked'"
        :custom-class="props.item.is_done ? 'done' : 'draft'"
      />
    </div>
    <div class="col-span-1">
      <CustomInput
        type="number"
        name="quantity"
        :id="`quantity-${props.item.id}`"
        v-model="model.physical_quantity"
        placeholder="Quantity"
        input-class="disabled:bg-transparent"
        :disabled="props.item.is_done && !isEdit"
      />
    </div>
    <div class="col-span-2">
      <CustomInput
        type="textarea"
        name="remarks"
        v-model="model.remarks"
        placeholder="Remarks"
        :id="`remarks-${props.item.id}`"
        input-class="disabled:bg-transparent"
        :disabled="props.item.is_done && !isEdit"
      />
    </div>
    <div class="col-span-1 flex items-center">
      <img
        src="@/assets/icons/vertical-menu.svg"
        alt=""
        class="cursor-pointer menu-btn-trigger"
        @click.stop="
          openMenu({
            id: props.item.id,
            is_done: props.item.is_done && !isEdit,
          })
        "
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Event from "@/event";
import CustomInput from "../shared/CustomInput.vue";
import BadgeComponent from "../shared/BadgeComponent.vue";
import { EventEnum } from "@/data/event";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  hasCheckBox: {
    type: Boolean,
  },
});

const isEdit = ref(false);
const emit = defineEmits(["openMenu"]);

const model = ref({
  is_done: props.item.is_done,
  physical_quantity: props.item.physical_quantity,
  remarks: props.item.remarks,
});

const physicalInventoryStore = usePhysicalInventoryStore();

/** ================================================
 * EVENTS
 ** ================================================*/

// On edit item
Event.on(`${EventEnum.PI_ITEM_EDIT}-${props.item.id}`, function () {
  isEdit.value = true;
});

// On update item
Event.on(`${EventEnum.PI_ITEM_UPDATE}-${props.item.id}`, async function () {
  model.value.is_done = true;
  const res = await physicalInventoryStore.updateItem(
    props.item.id,
    model.value
  );

  if (res.status == 200) {
    const physical_inventory_id = physicalInventoryStore.physicalInventory.id;
    await physicalInventoryStore.fetchOne(physical_inventory_id);
    isEdit.value = false;
  }
});

/** ================================================
 * METHODS
 ** ================================================*/
const openMenu = (data) => {
  emit("openMenu", data);
};
</script>
