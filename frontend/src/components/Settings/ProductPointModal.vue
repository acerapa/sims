<template>
  <ModalWrapper
    v-model="showModal"
    title="New Ordering Point"
    modal-class="[&>form>div]:overflow-visible"
    :has-delete="props.selectedId ? true : false"
    @submit="onSubmit"
    @delete="onDelete"
  >
    <div class="flex flex-col gap-5">
      <CustomInput
        name="points"
        type="number"
        class="mt-6"
        :has-label="true"
        label="Reordering Point"
        placeholder="Re-ordering Points"
        v-model="model.point"
        :error="modelErrors.point"
        :error-has-text="true"
      />
      <CustomInput
        type="select"
        :has-label="true"
        label="Products"
        name="included-products"
        :options="productOptions"
        v-model="model.products"
        @add-new="showProductModal = true"
        placeholder="Select included products"
        :has-add-new="true"
        :can-search="true"
        :select-multiple="true"
        :error="modelErrors.products"
        :error-has-text="true"
      />
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-if="showConfirmModal"
    v-model="showConfirmModal"
    :href="`product-setting/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
  <ProductModal v-model="showProductModal" v-if="showProductModal" />
</template>
<script setup>
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import { onMounted, computed, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductModal from '@/components/Product/ProductModal.vue'
import { authenticatedApi, Method } from '@/api'
import { useSettingsStore } from '@/stores/settings'
import { ProductReorderSchema } from 'shared'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const showModal = defineModel()
const showConfirmModal = ref(false)
const productStore = useProductStore()
const settingStore = useSettingsStore()

const href = ref(
  props.selectedId ? 'product-setting/update' : 'product-setting/register'
)

const showProductModal = ref(false)

const productOptions = computed(() => {
  return productStore.products.map((product) => {
    return {
      value: product.id,
      text: product.name
    }
  })
})

const model = ref({
  point: '',
  products: []
})

const modelErrors = ref({})

onMounted(async () => {
  await productStore.fetchAllProducts()
  if (props.selectedId) {
    let orderingPoint = settingStore.productReorderingPoints.find(
      (point) => point.id == props.selectedId
    )

    if (orderingPoint) {
      model.value = { ...orderingPoint }
      model.value.products = orderingPoint.products.map((product) => product.id)
    }
  }
})

const onSubmit = async () => {
  // validations
  const { error } = ProductReorderSchema.options({
    allowUnknown: true
  }).validate(model.value)
  if (error) {
    error.details.forEach((err) => {
      modelErrors.value[err.context.key] = err.message
    })

    return
  }

  const res = await authenticatedApi(href.value, Method.POST, model.value)
  if (res.status == 200) {
    await settingStore.fetchAllProductReorderingPoints()
    showModal.value = false
  }
}

const onDelete = () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  showConfirmModal.value = false
  await settingStore.fetchAllProductReorderingPoints()
}
</script>
