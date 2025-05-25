<template>
  <div class="relative overflow-x-hidden main-table">
    <div class="table-wrapper w-full relative flex flex-col gap-4">
      <!-- Table tools -->
      <div class="sticky top-0">
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
        <p v-if="props.title" class="font-bold text-sm mb-3">
          {{ props.title }}
        </p>
        <div class="flex justify-between items-center" v-if="props.hasTools">
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
              name="search"
              placeholder="Search"
              v-model="searchText"
              class="input w-full max-w-72"
              :id="`search-${instance.uid}`"
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
          <div>
            <slot name="tools"></slot>
          </div>
          <div class="flex gap-3" v-if="props.hasAddBtn">
            <button
              class="bg-primary p-2 rounded flex items-center gap-3"
              @click="onAddNew"
            >
              <img src="@/assets/icons/plus.svg" alt="Plus" />
              <span class="text-white text-sm" v-if="props.btnCustomText">{{
                props.btnCustomText
              }}</span>
            </button>
            <!-- Custom buttons -->
            <slot name="buttons"></slot>
          </div>
        </div>

        <!-- TODO: This part is currently hidden because this part will be worked on later with filters -->
        <div class="flex flex-wrap gap-3 py-3 hidden">
          <div
            class="py-1 pl-3 pr-1 text-sm rounded-full border text-gray-600 flex gap-3 items-center"
          >
            <span>Test sgsdsksgk</span>
            <button class="px-1.5 w-6 h-6 text-lg border relative rounded-full">
              <span
                class="absolute top-[44.1%] left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                &times;
              </span>
            </button>
          </div>
        </div>

        <hr class="bg-gray-50 -mx-4 mt-3" v-if="props.hasTools" />
      </div>

      <!-- Table body -->
      <div
        class="flex flex-col gap-7 w-full pb-5 overflow-x-auto overflow-y-hidden"
        :class="props.hasTools ? '' : '-mt-4'"
      >
        <!-- Default slot -->
        <slot></slot>

        <!-- Table Header -->
        <component
          :is="props.tableHeaderComponent"
          :has-check-box="props.hasCheckBox"
        />
        <slot v-if="!props.tableHeaderComponent" name="table_header"></slot>

        <!-- Table Body -->
        <div
          class="flex flex-col gap-4"
          v-if="props.tableRowComponent && items.length && !props.isNested"
          :key="props.data"
        >
          <component
            :is="props.tableRowComponent"
            v-for="item in items"
            :key="item.hasOwnProperty('id') ? item.id : item"
            v-bind="Event.emit(props.rowPropInit, item)"
            :has-check-box="props.hasCheckBox"
            @open-menu="
              (data) => {
                emit('open-menu', data)
              }
            "
            @view="
              (data) => {
                emit('view', data)
              }
            "
          />
        </div>
        <div
          class="flex items-center justify-center"
          v-if="!items.length && !props.isNested"
        >
          <p class="text-sm">Table has no data!</p>
        </div>
        <slot
          v-if="!props.tableRowComponent && !props.isNested"
          name="table_body"
        ></slot>
      </div>

      <!-- Table pagination -->
      <Paginate
        class="ml-auto mr-0"
        v-if="props.hasPagination && items.length"
        :data="props.data"
        :key="props.data"
        :items-show="props.pgOptions.showItems"
        :item-selected="showItemSelected"
        v-model:show-item-selected="showItemSelected"
        v-model:current-items="items"
      />
    </div>

    <slot v-if="props.isNested" name="tables"></slot>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, watch } from 'vue'
import Paginate from './Paginate.vue'
import FilterComponent from './FilterComponent.vue'
import Event from '@/event'

const emit = defineEmits([
  'update:showModal',
  'update:isEdit',
  'open-menu',
  'update:searchText',
  'addNewRecord',
  'view'
])

const props = defineProps({
  title: {
    type: String
  },
  hasPagination: {
    type: Boolean,
    default: false
  },
  hasAddBtn: {
    type: Boolean,
    default: true
  },
  hasFilter: {
    type: Boolean,
    default: false
  },
  hasTools: {
    type: Boolean,
    default: true
  },
  hasCheckBox: {
    type: Boolean,
    default: true
  },
  tableHeaderComponent: {
    type: Object,
    required: false
  },
  tableRowComponent: {
    type: Object,
    required: false
  },
  isNested: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: []
  },
  rowPropInit: {
    type: String,
    required: false
  },
  pgOptions: {
    type: Object,
    default: {
      showItems: [5, 10, 20, 50, 100]
    }
  },
  btnCustomText: {
    type: String,
    required: false
  }
})

// Custom warning for required props with condition
if (!props.isNested) {
  if (!props.rowPropInit) console.warn('Missing required prop: `rowPropInit`')
}

const instance = getCurrentInstance()

const filter = ref()
Event.on(
  'global-click',
  function () {
    if (filter.value) {
      if (!filter.value.contains(event.target)) {
        showFilter.value = false
      }
    }
  },
  true
)

// vars
const items = ref(props.data)
const showItemSelected = ref(5)

// flags
const showFilter = ref(false)
const filterUsed = ref(false)

// watchers
watch(
  () => props.data,
  (value) => (items.value = value)
)

// models
const isEdit = defineModel('isEdit')
const showModal = defineModel('showModal')
const searchText = defineModel('searchText')

// methods
const onAddNew = () => {
  showModal.value = true
  isEdit.value = false

  emit('addNewRecord')
}
</script>

<style scoped></style>
