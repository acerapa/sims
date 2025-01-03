<template>
  <div class="group">
    <div
      class="grid grid-cols-7 gap-3 min-w-[550px] gen-table-row"
      @click="emit('view', props.productCategory.id)"
    >
      <div class="col-span-1 flex gap-3 items-center">
        <input type="checkbox" class="input" />
        <p class="text-sm">{{ props.productCategory.id }}</p>
      </div>
      <p class="col-span-3 text-sm">{{ props.productCategory.name }}</p>
      <p class="col-span-1">
        {{ props.productCategory.sub_categories.length }}
      </p>
      <div class="col-span-2 flex items-center gap-5">
        <p class="text-sm">
          {{
            DateHelpers.formatDate(props.productCategory.createdAt, 'M/D/YYYY')
          }}
        </p>

        <button
          @click.stop="isExpand = !isExpand"
          class="bg-gray-500 text-white w-6 h-6 flex text-center items-center justify-center rounded-full"
        >
          <span v-if="!isExpand" class="border-0">&plus;</span>
          <span v-if="isExpand" class="border-0">&minus;</span>
        </button>
      </div>
    </div>

    <div class="text-sm" v-if="isExpand">
      <button type="btn" class="btn" @click="showModal = true">
        &plus; Add
      </button>
    </div>
  </div>
  <ProductCategoryModal
    :general_cat="props.productCategory.id"
    v-if="showModal"
    v-model="showModal"
  />
</template>

<script setup>
import { DateHelpers } from 'shared'
import ProductCategoryModal from './ProductCategoryModal.vue'
import { ref } from 'vue'

const isExpand = ref(false)
const showModal = ref(false)

const props = defineProps({
  productCategory: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['view'])
</script>
