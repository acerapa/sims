<template>
  <div class="cont flex flex-col gap-4">
    <div class="tools">
      <div class="flex flex-col gap-2">
        <p v-if="props.title" class="font-bold text-lg">{{ props.title }}</p>
        <div class="flex gap-3">
          <CustomInput
            name="table-search"
            type="search"
            placeholder="Search"
            v-model="searchText"
          />
          <CustomInput
            v-if="props.hasPagination"
            name="table-items"
            type="select"
            :options="pagination.generateShowItemOptions()"
            v-model="itemSelected"
          />
        </div>
      </div>
      <div class="flex gap-3">
        <button
          v-if="props.hasAddBtn"
          class="bg-primary p-2 rounded"
          @click="onAddNew"
        >
          <img src="@/assets/icons/plus.svg" alt="Plus" />
        </button>

        <!-- Custom buttons -->
        <slot name="buttons"></slot>
      </div>
    </div>
    <div class="content">
      <div class="table-header">
        <component v-if="props.tableHeader" :is="props.tableHeader"></component>
        <slot v-if="!props.tableHeader" name="table-header"></slot>
      </div>
      <div class="table-body">
        <component
          v-if="props.tableRow"
          :is="props.tableRow"
          v-for="item in paginatedItems"
          :key="item.hasOwnProperty('id') ? item.id : item"
          v-bind="{ row: item }"
        ></component>
        <slot v-if="!props.tableRow" name="table-body"></slot>
      </div>
    </div>
    <Paginate
      :data="props.data"
      :items-show="pagination.showItems"
      :item-selected="itemSelected"
      v-model:show-item-selected="testItems"
      v-model:current-items="testItems"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import Paginate from './Paginate.vue';
import CustomInput from './CustomInput.vue';
import { usePagination } from '@/use/usePagination';

const pagination = usePagination();

const props = defineProps({
  tableRow: {
    type: Object,
    default: () => ({})
  },
  tableHeader: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: []
  },
  title: {
    type: String,
    required: false
  },
  hasAddBtn: {
    type: Boolean,
    default: true
  },
  hasPagination: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['addNew']);

const itemSelected = ref(pagination.showItems[0]);

const searchText = defineModel('searchText');

// pagination test
const testItems = ref([]);

const paginatedItems = props.data;
</script>

<style scoped>
.tools {
  @apply flex items-start justify-between border-b -mx-4 px-4 pb-4;
}
</style>
