<template>
  <div class="grid grid-cols-11 gap-3 min-w-[760px] gen-table-row">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" v-if="hasCheckBox" />
      <p class="text-sm">{{ props.item.id }}</p>
    </div>
    <p class="col-span-2 text-sm py-2">{{ props.item.name }}</p>
    <p class="col-span-3 text-sm py-2">{{ props.item.item_description }}</p>
    <p class="col-span-1 text-sm py-2">{{ props.item.quantity }}</p>
    <div class="col-span-1">
      <input class="text-sm input w-full min-w-0" placeholder="Quantity" />
    </div>
    <div class="col-span-2">
      <textarea
        class="text-sm input shrink-0 w-full min-w-0"
        placeholder="Remarks"
      ></textarea>
    </div>
    <div class="col-span-1 flex items-center">
      <input
        type="checkbox"
        class="w-4 h-4"
        @change="onCheckItem(props.item.id)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  hasCheckBox: {
    type: Boolean,
  },
});

const onCheckItem = async (id) => {
  // TODO: Call api to update the "is_done" status
  // of the item

  console.log("Inprogress => " + id);
};
</script>
