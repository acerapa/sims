<template>
  <div class="table-wrapper w-full relative">
    <div class="flex justify-between items-center">
      <input type="search" class="input w-full max-w-72" placeholder="Search" />
      <button
      v-if="props.hasAddBtn"
        class="bg-primary p-2 rounded"
        @click="
          showModal = true;
          isEdit = false;
        "
      >
        <img src="@/assets/icons/plus.svg" alt="Plus" />
      </button>
    </div>
    <hr class="bg-gray-50 -mx-4" />
    <div class="flex flex-col gap-7 overflow-x-auto pb-5">
      <!-- Default slot -->
      <slot></slot>
      <!-- Table Header -->
      <slot name="table_header"></slot>
      <!-- Table Body -->
      <slot name="table_body"></slot>
    </div>
    <Paginate v-if="props.hasPagination" />
  </div>
</template>

<script setup>
import Paginate from "./Paginate.vue";
const emit = defineEmits(["update:showModal", "update:isEdit"]);
const props = defineProps({
  hasPagination: {
    type: Boolean,
    default: false,
  },
  hasAddBtn: {
    type: Boolean,
    default: true,
  },
});

const showModal = defineModel("showModal");
const isEdit = defineModel("isEdit");
</script>
