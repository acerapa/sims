<template>
  <div
    class="group pr-3 py-1"
    :class="[
      isExpand ? 'bg-blue-50 rounded' : '',
      `test-${props.productCategory.id}`
    ]"
  >
    <div
      class="grid grid-cols-7 ml-3 gap-3 min-w-[550px] gen-table-row items-center"
      @click.stop="onClickCategory"
    >
      <div class="col-span-1 flex gap-3 items-center">
        <input v-if="props.hasCheckBox" type="checkbox" class="input" />
        <p class="text-sm">{{ props.productCategory.id }}</p>
      </div>
      <p class="col-span-3 text-sm">{{ props.productCategory.name }}</p>
      <p class="col-span-1">
        {{
          props.productCategory.sub_categories
            ? props.productCategory.sub_categories.length
            : 0
        }}
      </p>
      <div class="col-span-2 flex items-center gap-5">
        <p class="text-sm">
          {{
            DateHelpers.formatDate(props.productCategory.createdAt, 'M/D/YYYY')
          }}
        </p>

        <button
          @click.stop="isExpand = !isExpand"
          class="bg-gray-500 min-w-6 text-white w-6 h-6 flex text-center items-center justify-center rounded-full"
        >
          <span v-if="!isExpand" class="border-0">&plus;</span>
          <span v-if="isExpand" class="border-0">&minus;</span>
        </button>

        <button
          type="btn"
          v-if="isExpand"
          @click.stop="showModal = true"
          class="btn ml-auto mr-0 text-sm"
        >
          &plus; Add Sub
        </button>
      </div>
    </div>

    <div class="text-sm" v-if="isExpand">
      <div class="p-1 ml-3 rounded flex flex-col gap-3 bg-white">
        <ProductCategoryRow
          v-for="sub_cat in props.productCategory.sub_categories"
          :key="sub_cat.id"
          :is_sub="true"
          :productCategory="sub_cat"
          @view="emit('view', sub_cat.id)"
        />
        <p
          class="text-center font-thin text-gray-800 italic"
          v-if="
            !props.productCategory.sub_categories ||
            props.productCategory.sub_categories.length === 0
          "
        >
          No Sub Categories
        </p>
      </div>
    </div>
  </div>
  <ProductCategoryModal
    v-if="showModal"
    v-model="showModal"
    :general_cat="props.productCategory.id"
  />
</template>

<script setup>
import { DateHelpers } from 'shared'
import ProductCategoryModal from './ProductCategoryModal.vue'
import { ref } from 'vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'

const isExpand = ref(false)
const showModal = ref(false)

const props = defineProps({
  productCategory: {
    type: Object,
    default: () => ({})
  },
  hasCheckBox: {
    type: Boolean,
    required: false
  },
  is_sub: {
    type: Boolean,
    default: false,
    required: false
  }
})

const emit = defineEmits([
  'view',
  'openMenu' /* openMenu is temporary and will be remove in the future */
])

const onClickCategory = () => {
  Event.emit(EventEnum.PRODUCT_CATEGORY_ROW, props.productCategory.id)
}
</script>
