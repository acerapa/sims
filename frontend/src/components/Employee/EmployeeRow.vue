<template>
  <div
    class="grid grid-cols-13 gap-3 items-center min-w-[792px] relative"
    @click="clickOutSide"
  >
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ user.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ user.first_name }}</p>
    <p class="col-span-2 text-sm">{{ user.last_name }}</p>
    <p class="col-span-2 text-sm">{{ user.position }}</p>
    <p class="col-span-2 text-sm">
      {{ Helpers.formatDate(user.date_started, "M/D/YYYY") }}
    </p>
    <p class="col-span-2 text-sm">
      {{
        user.date_ended ? Helpers.formatDate(user.date_ended, "M/D/YYYY") : "-"
      }}
    </p>
    <p class="col-span-1 text-sm">
      <button
        class="status bg-opacity-20"
        :class="
          user.status ? 'text-success bg-success' : 'text-gray-500 bg-gray-500'
        "
      >
        {{ user.status ? "Active" : "Inactive" }}
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
    <EmployeeRowMenu
      v-if="showActionMenu"
      @delete="
        emit('delete', user.id);
        action = false;
      "
      @view="
        emit('view', user.id);
        action = false;
      "
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import EmployeeRowMenu from "@/components/Employee/EmployeeRowMenu.vue";
import { Helpers } from "@/helpers";

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

const emit = defineEmits(["openMenu", "view", "delete"]);

const openMenu = (id) => {
  emit("openMenu", id);
};

const action = ref(false);

const showActionMenu = computed(
  () => action.value && props.currentOpenMenu == props.user.id
);

const clickOutSide = (event) => {
  if (Array.from(event.target.classList).includes("menu-btn-trigger")) {
    action.value = !action.value; // toggle effect
  } else {
    action.value = false;
  }
};
</script>
