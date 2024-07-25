<template>
  <div class="table-wrapper w-full relative">
    <!-- filter -->
    <div ref="filter">
      <FilterComponent
        v-model="showFilter"
        v-if="showFilter"
        v-model:is-filter-used="filterUsed"
      >
        <template v-slot:filters>
          <slot name="filters"></slot>
        </template>
      </FilterComponent>
    </div>
    <p v-if="props.title" class="font-bold text-sm">{{ props.title }}</p>
    <div class="flex justify-between items-center">
      <div class="flex gap-3 items-center">
        <div
          class="rounded border cursor-pointer w-[64px] h-[38px] p-1 flex items-center justify-center"
          :class="
            filterUsed
              ? '[&>img]:brightness-0 [&>img]:invert bg-primary border-primary '
              : ''
          "
          @click.stop="showFilter = true"
          v-if="props.hasFilter"
        >
          <img
            src="@/assets/icons/funnel.png"
            class="max-w-[30px] max-h-[26px] w-full h-full object-fill"
            alt="funnel"
          />
        </div>
        <input
          type="search"
          class="input w-full max-w-72"
          placeholder="Search"
          v-model="searchText"          
        />
        <select
          name="show-item"
          id="show-item"
          class="input"
          v-model="showItemSelected"
        >
          <option
            v-for="(val, ndx) in props.pgOptions.showItems"
            :key="ndx"
            :value="val"
          >
            {{ val }}
          </option>
        </select>
      </div>
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
      <component :is="props.tableHeaderComponent" />
      <slot v-if="!props.tableHeaderComponent" name="table_header"></slot>

      <!-- Table Body -->
      <div
        class="flex flex-col gap-4"
        v-if="props.tableRowComponent && items.length"
      >
        <component
          :is="props.tableRowComponent"
          v-for="(item, ndx) in items"
          :key="ndx"
          v-bind="Event.emit(props.rowPropInit, item)"
          @open-menu="
            (data) => {
              emit('open-menu', data);
            }
          "
        />
      </div>
      <div class="flex items-center justify-center" v-if="!items.length">
        <p class="text-sm">Table has no data!</p>
      </div>
      <slot v-if="!props.tableRowComponent" name="table_body"></slot>
    </div>
    <Paginate
      class="ml-auto mr-0"
      v-if="props.hasPagination && items.length"
      :data="props.data"
      :items-show="props.pgOptions.showItems"
      :item-selected="showItemSelected"
      v-model:show-item-selected="showItemSelected"
      v-model:current-items="items"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Paginate from "./Paginate.vue";
import FilterComponent from "./FilterComponent.vue";
import Event from "@/event";

const emit = defineEmits(["update:showModal", "update:isEdit", "open-menu", "update:searchText"]);
const props = defineProps({
  title: {
    type: String,
  },
  hasPagination: {
    type: Boolean,
    default: false,
  },
  hasAddBtn: {
    type: Boolean,
    default: true,
  },
  hasFilter: {
    type: Boolean,
    default: false,
  },
  tableHeaderComponent: {
    type: Object,
    required: false,
  },
  tableRowComponent: {
    type: Object,
    required: false,
  },
  data: {
    type: Object,
    default: [],
  },
  rowPropInit: {
    type: String,
    required: false, // should be set to true, until we finish all the table we can turn it to required
  },
  pgOptions: {
    type: Object,
    default: {
      showItems: [5, 10, 20, 50, 100],
    },
  },
});

const filter = ref();
Event.on(
  "global-click",
  function () {
    if (filter.value) {
      if (!filter.value.contains(event.target)) {
        showFilter.value = false;
      }
    }
  },
  true
);

// vars
const items = ref(props.data);
const showItemSelected = ref(5);

// flags
const showFilter = ref(false);
const filterUsed = ref(false);

// watchers
watch(
  () => props.data,
  (value) => (items.value = value)
);

// models
const showModal = defineModel("showModal");
const isEdit = defineModel("isEdit");
const searchText = defineModel("searchText");
</script>

<style scoped></style>
