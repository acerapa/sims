<template>
  <div class="grid grid-cols-9 gap-3 min-w-[760px] gen-table-row">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.item.id }}</p>
    </div>
    <p class="col-span-1 text-sm">{{ props.item.name }}</p>
    <p class="col-span-2 text-sm">{{ props.item.item_description }}</p>
    <p class="col-span-1 text-sm">{{ props.item.quantity }}</p>
    <div class="col-span-1">
      <input class="text-sm input w-full min-w-0" placeholder="Quantity" />
    </div>
    <div class="col-span-2">
      <textarea
        class="text-sm input shrink-0 w-full min-w-0"
        placeholder="Remarks"
      ></textarea>
    </div>
    <div class="col-span-1 text-sm">
      <img
        @click.stop="openMenu(props.item.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
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
});

const emit = defineEmits(["openMenu"]);

const openMenu = (id) => {
  emit("openMenu", id);
};
</script>
