<template>
  <div>
    <ProductCategoryModal
      v-model="showCategoryModal"
      v-if="showCategoryModal"
      :selected-id="selectedCategoryId"
    />
    <ProductPointModal
      v-model="showReorderingPointModal"
      v-if="showReorderingPointModal"
      :selected-id="selectedReorderingId"
    />
    <div class="flex flex-col gap-6">
      <div ref="tableRefPoint">
        <CustomTable
          :has-pagination="true"
          title="Product Reordering Point"
          :data="filteredReorderingPoints"
          @add-new-record="onNewReorderingPoint"
          :row-prop-init="productReorderingRowEvent"
          :table-row-component="ProductReorderingPointRow"
          @view="onViewReOrdering"
        >
          <template #table_header>
            <div class="grid grid-cols-5 gap-3 min-w-[430px]">
              <div class="col-span-2 flex gap-3 items-center">
                <input type="checkbox" class="input" />
                <p class="table-header">#</p>
              </div>
              <p class="table-header col-span-3">Points</p>
            </div>
          </template>
        </CustomTable>
      </div>

      <div ref="tableRefCat">
        <CustomTable
          :has-add-btn="true"
          :has-pagination="true"
          :has-check-box="false"
          title="Product Categories"
          :data="filteredProductCategories"
          @add-new-record="onNewProductCategory"
          :row-prop-init="productCategoryRowEvent"
          :table-row-component="ProductCategoryRow"
        >
          <template #table_header>
            <div class="grid gap-3 grid-cols-7 min-w-[550px] px-3">
              <div class="col-span-1 flex gap-3 items-center">
                <!-- <input type="checkbox" class="input" /> -->
                <p class="table-header">#</p>
              </div>
              <p class="col-span-3 table-header">Name</p>
              <p class="col-span-1 table-header">Sub Cats</p>
              <p class="col-span-2 table-header">Date Added</p>
            </div>
          </template>
        </CustomTable>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import ProductPointModal from '@/components/Settings/ProductPointModal.vue'
import ProductCategoryModal from '@/components/Settings/ProductCategoryModal.vue'
import ProductCategoryRow from '@/components/Settings/ProductCategoryRow.vue'
import { useSettingsStore } from '@/stores/settings'
import CustomTable from '@/components/shared/CustomTable.vue'
import ProductReorderingPointRow from '@/components/Settings/ProductReorderingPointRow.vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { useTableScroll } from '@/use/useTableScroll'

const settingsStore = useSettingsStore()

const selectedReorderingId = ref(0)
const showReorderingPointModal = ref(false)

const selectedCategoryId = ref(0)
const showCategoryModal = ref(false)

const tableRefPoint = ref(null)
const tableRefCat = ref(null)

// composables
useTableScroll(tableRefPoint, false)
useTableScroll(tableRefCat, false)

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true)

// define Product categories row props
const productCategoryRowEvent = 'product-category-row-props-init'
Event.on(productCategoryRowEvent, function (item) {
  return { productCategory: item }
})

// define Product reordering point row props
const productReorderingRowEvent = 'product-reordering-row-props-init'
Event.on(productReorderingRowEvent, function (item) {
  return { productReordering: item }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredProductCategories = computed(() => {
  return settingsStore.productCategories.filter(
    (category) => !category.general_cat
  )
})

const filteredReorderingPoints = computed(() => {
  return settingsStore.productReorderingPoints.filter(() => true)
})

/** ================================================
 * METHODS
 ** ================================================*/
const onViewCategory = (id) => {
  selectedCategoryId.value = id
  showCategoryModal.value = true
}

const onViewReOrdering = (id) => {
  selectedReorderingId.value = id
  showReorderingPointModal.value = true
}

const onNewReorderingPoint = () => {
  selectedReorderingId.value = 0
  showReorderingPointModal.value = true
}

const onNewProductCategory = () => {
  selectedCategoryId.value = 0
  showCategoryModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await settingsStore.getProductCategories()
  await settingsStore.fetchAllProductReorderingPoints()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})

// lower event listeners
Event.on(EventEnum.PRODUCT_CATEGORY_ROW, onViewCategory)
</script>
