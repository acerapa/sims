<template>
  <ModalWrapper
    v-model="showModal"
    title="New Ordering Point"
    modal-class="[&>form>div]:overflow-visible"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-3">
      <CustomInput
        name="points"
        type="number"
        class="mt-6"
        placeholder="Re-ordering Points"
        v-model="model.point"
      />
      <CustomInput
        type="select"
        name="included-products"
        :options="productOptions"
        v-model="model.products"
        @add-new="showProductModal = true"
        placeholder="Select included products"
        :has-add-new="true"
        :can-search="true"
        :select-multiple="true"
      />
    </div>
  </ModalWrapper>
  <ProductModal v-model="showProductModal" v-if="showProductModal" />
</template>
<script setup>
import ModalWrapper from '@/components/shared/ModalWrapper.vue';
import CustomInput from '@/components/shared/CustomInput.vue';
import CustomSelectInput from '@/components/shared/CustomInput.vue';
import { onMounted, computed, ref } from 'vue';
import { useProductStore } from '@/stores/product';
import ProductModal from '@/components/Product/ProductModal.vue';
import { authenticatedApi, Method } from '@/api';
import { useSettingsStore } from '@/stores/settings';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedId: {
    type: Number,
    required: false,
  },
});

const showModal = defineModel();
const productStore = useProductStore();
const settingStore = useSettingsStore();

const href = ref(
  props.isEdit ? 'product-setting/update' : 'product-setting/register',
);

const showProductModal = ref(false);

const productOptions = computed(() => {
  return productStore.products.map((product) => {
    return {
      value: product.id,
      text: product.name,
    };
  });
});

const model = ref({
  point: '',
  products: [],
});

onMounted(async () => {
  await productStore.fetchAllProducts();
  if (props.isEdit && props.selectedId) {
    let orderingPoint = settingStore.productReorderingPoints.find(
      (point) => point.id == props.selectedId,
    );

    if (orderingPoint) {
      model.value = { ...orderingPoint };
      model.value.products = orderingPoint.products.map(
        (product) => product.id,
      );
    }
  }
});

const onSubmit = async () => {
  const res = await authenticatedApi(href.value, Method.POST, model.value);
  if (res.status == 200) {
    await settingStore.fetchAllProductReorderingPoints();
    showModal.value = false;
  }
};
</script>
