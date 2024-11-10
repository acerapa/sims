<template>
  <div>
    <ProductModal v-model="showModal" v-if="showModal" />
    <slot></slot>
    <div
      class="grid gap-3 items-start min-w-[750px]"
      :class="[props.isDisabled ? 'grid grid-cols-8' : 'grid-cols-9']"
    >
      <div class="col-span-2 flex gap-3">
        <CustomInput
          type="checkbox"
          name="checkbox"
          v-if="!props.isDisabled"
          class="flex-shrink-0 mt-[10px]"
        />
        <CustomInput
          type="select"
          class="w-full"
          name="select_product"
          placeholder="Select product"
          :options="productStore.productOptions"
          :has-add-new="true"
          @add-new="showModal = true"
          v-model="model.product_id"
          :can-search="true"
          :disabled="props.isDisabled"
          @change="onChange"
        />
      </div>
      <CustomInput
        type="text"
        class="col-span-3"
        name="description"
        placeholder="Description"
        :disabled="props.isDisabled"
        v-model="model.description"
      />
      <CustomInput
        type="number"
        name="quantity"
        class="col-span-1"
        placeholder="quantity"
        v-model="model.quantity"
        :disabled="props.isDisabled"
      />
      <CustomInput
        name="cost"
        type="number"
        class="col-span-1"
        placeholder="Cost"
        v-model="model.cost"
        :disabled="props.isDisabled"
      />
      <CustomInput
        type="number"
        name="amount"
        class="col-span-1"
        placeholder="Amount"
        v-model="model.amount"
        :disabled="props.isDisabled"
      />
      <p
        class="col-span-1 text-sm pl-3 mt-[10px]"
        :class="[props.isDisabled ? 'hidden' : '']"
      >
        <img
          @click="emit('remove')"
          src="@/assets/icons/remove.svg"
          class="cursor-pointer w-5 h-5"
          alt="remove"
        />
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import CustomInput from '../shared/CustomInput.vue';
import ProductModal from '../Product/ProductModal.vue';
import { useProductStore } from '@/stores/product';

const emit = defineEmits(['remove']);

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
});
const showModal = ref(false);
const model = defineModel();

const productStore = useProductStore();

const onChange = () => {
  if (model.value.product_id) {
    const product = productStore.products.find(
      (prd) => prd.id == model.value.product_id,
    );

    if (product) {
      model.value.description = product.purchase_description;
      model.value.cost = product.price;
      model.value.quantity = 1;
    }
  } else {
    model.value.name = '';
    model.value.product_id = '';
    model.value.description = '';
    model.value.quantity = '';
    model.value.cost = '';
  }
};

watch(
  () => model.value.quantity,
  () => {
    model.value.amount = model.value.cost * model.value.quantity;
  },
);
</script>
