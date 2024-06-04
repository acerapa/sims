<template>
  <div class="grid grid-cols-13 gap-3 items-center min-w-[792px] relative">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ user.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ user.first_name }}</p>
    <p class="col-span-2 text-sm">{{ user.last_name }}</p>
    <p class="col-span-2 text-sm">{{ user.position }}</p>
    <p class="col-span-2 text-sm">
      {{ new Date(user.date_started).toLocaleDateString() }}
    </p>
    <p class="col-span-2 text-sm">
      {{
        user.date_ended ? new Date(user.date_ended).toLocaleDateString() : "-"
      }}
    </p>
    <p class="col-span-1 text-sm">
      <button class="status text-success bg-success bg-opacity-20">
        Active
      </button>
    </p>
    <div class="col-span-1 text-sm">
      <img
        @click="openMenu(props.user.id)"
        class="cursor-pointer menu-btn-trigger"
        src="@/assets/icons/vertical-menu.svg"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  currentOpenMenu: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["openMenu"]);

const openMenu = (id) => {
  action.value = true;
  emit("openMenu", id);
};

const action = ref(false);

const showActionMenu = computed(
  () => action && props.currentOpenMenu == props.user.id
);
</script>
