<template>
  <div class="grid grid-cols-9 gap-3 relative" @click="clickOutSide">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.account.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.account.name }}</p>
    <p class="col-span-2 text-sm">{{ props.account.type }}</p>
    <p class="col-span-2 text-sm">
      {{ Helpers.formatDate(props.account.createdAt, "M/D/YYYY") }}
    </p>
    <p class="col-span-1 text-sm">
      <img
        src="@/assets/icons/vertical-menu.svg"
        alt=""
        class="cursor-pointer menu-btn-trigger"
        @click="openMenu(props.account.id)"
      />
    </p>
    <AccountRowMenu
      v-if="showActionMenu"
      @delete="
        emit('delete', props.account.id);
        action = false;
      "
      @view="
        emit('view', props.account.id);
        action = false;
      "
    />
  </div>
</template>

<script setup>
import AccountRowMenu from "@/components/Settings/AccountRowMenu.vue";
import { ref, computed } from "vue";
import { Helpers } from "@/helpers";
const emit = defineEmits(["delete", "view", "openMenu"]);
const props = defineProps({
  account: {
    type: Object,
    default: () => ({}),
  },
  currentOpenMenu: {
    type: Number,
    required: true,
  },
});
const action = ref(false);
const showActionMenu = computed(
  () => action.value && props.currentOpenMenu == props.account.id
);

const openMenu = (id) => {
  emit("openMenu", id);
};

const clickOutSide = (event) => {
  if (Array.from(event.target.classList).includes("menu-btn-trigger")) {
    action.value = !action.value; // toggle effect
  } else {
    action.value = false;
  }
};
</script>
