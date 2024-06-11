<template>
  <div
    class="grid grid-cols-7 gap-3 items-center relative"
    @click="clickOutSide"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.supplier.id }}</p>
    </div>
    <p class="col-span-3 text-sm truncate">{{ props.supplier.company_name }}</p>
    <p class="col-span-2 text-sm truncate">
      {{
        `${props.supplier.annotation} ${props.supplier.first_name} ${props.supplier.last_name}`
      }}
    </p>
    <div class="col-span-1 text-sm">
      <img
        @click="openMenu(props.supplier.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
    <VendorRowMenu
      v-if="showActionMenu"
      @delete="
        emit('delete', props.supplier.id);
        action = false;
      "
      @view="
        emit('view', props.supplier.id);
        action = false;
      "
    />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import VendorRowMenu from "./VendorRowMenu.vue";
const props = defineProps({
  supplier: {
    type: Object,
    default: () => ({}),
  },
  currentOpenMenu: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["delete", "view", "openMenu"]);

const openMenu = (id) => {
  emit("openMenu", id);
};

const action = ref(false);

const showActionMenu = computed(
  () => action.value && props.currentOpenMenu == props.supplier.id
);

const clickOutSide = (event) => {
  if (Array.from(event.target.classList).includes("menu-btn-trigger")) {
    action.value = !action.value; // toggle effect
  } else {
    action.value = false;
  }
};
</script>
