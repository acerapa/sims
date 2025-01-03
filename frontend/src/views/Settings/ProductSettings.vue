<template>
  <div>
    <ProductCategoryModal
      v-model="showModal"
      v-if="showModal"
      :selected-id="selectedId"
    />
    <ProductPointModal
      v-model="reorderingModalShow"
      v-if="reorderingModalShow"
      :selected-id="selectedReorderingId"
    />
    <div class="flex flex-col gap-6">
      <CustomTable
        :has-pagination="true"
        title="Product Reordering Point"
        @add-new-record="onNewReorderingPoint"
        :row-prop-init="productReorderingRowEvent"
        :data="settingsStore.productReorderingPoints"
        :table-row-component="ProductReorderingPointRow"
        @view="onViewReOrdering"
      >
        <template #table_header>
          <div class="grid grid-cols-5 gap-3 min-w-[430px]">
            <div class="col-span-1 flex gap-3 items-center">
              <input type="checkbox" class="input" />
              <p class="table-header">#</p>
            </div>
            <p class="table-header col-span-1">Points</p>
            <p class="table-header col-span-3">Products</p>
          </div>
        </template>
      </CustomTable>
      <CustomTable
        :has-add-btn="true"
        :has-pagination="true"
        @view="onViewCategory"
        @add-new-record="onNewProductCategory"
        title="Product Categories"
        :data="settingsStore.productCategories"
        :row-prop-init="productCategoryRowEvent"
        :table-row-component="ProductCategoryRow"
      >
        <template #table_header>
          <div class="grid gap-3 grid-cols-7 min-w-[550px]">
            <div class="col-span-1 flex gap-3 items-center">
              <input type="checkbox" class="input" />
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
</template>
<script setup>
import { onMounted, ref } from 'vue'
import ProductPointModal from '@/components/Settings/ProductPointModal.vue'
import ProductCategoryModal from '@/components/Settings/ProductCategoryModal.vue'
import ProductCategoryRow from '@/components/Settings/ProductCategoryRow.vue'
import { useSettingsStore } from '@/stores/settings'
import CustomTable from '@/components/shared/CustomTable.vue'
import ProductReorderingPointRow from '@/components/Settings/ProductReorderingPointRow.vue'
import Event from '@/event'
import { EventEnum } from '@/data/event'

const selectedId = ref(-1)
const showModal = ref(false)
const selectedReorderingId = ref(-1)
const reorderingModalShow = ref(false)
const settingsStore = useSettingsStore()

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
 * METHODS
 ** ================================================*/
const onViewCategory = (id) => {
  selectedId.value = id
  showModal.value = true
}

const onViewReOrdering = (id) => {
  selectedReorderingId.value = id
  reorderingModalShow.value = true
}

const onNewReorderingPoint = () => {
  selectedReorderingId.value = 0
  reorderingModalShow.value = true
}

const onNewProductCategory = () => {
  selectedId.value = 0
  showModal.value = true
}
/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await settingsStore.fetchAllProductCategories()
  await settingsStore.fetchAllProductReorderingPoints()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
