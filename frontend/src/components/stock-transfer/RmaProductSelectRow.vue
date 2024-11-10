<template>
  <div>
    <div
      class="grid gap-3 items-start min-w-[750px]"
      :class="[props.isDisabled ? 'grid grid-cols-9' : 'grid-cols-10']"
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
        class="col-span-2"
        type="text"
        name="serial_number"
        placeholder="Serial number"
        :disabled="props.isDisabled"
        v-model="model.serial_number"
      />
      <CustomInput
        class="col-span-3"
        type="textarea"
        name="Problem"
        v-model="model.problem"
        :disabled="props.isDisabled"
        placeholder="Problem"
      />
      <CustomInput
        class="col-span-1"
        type="number"
        name="quantity"
        placeholder="Quantity"
        :disabled="props.isDisabled"
        v-model="model.quantity"
      />
      <CustomInput
        class="col-span-1"
        type="number"
        name="amount"
        placeholder="Amount"
        :disabled="props.isDisabled"
        v-model="model.amount"
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
import { useProductStore } from '@/stores/product';
import CustomInput from '../shared/CustomInput.vue';
import { onMounted } from 'vue';
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['remove']);
const productStore = useProductStore();
const model = defineModel();

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
    model.value.serial_number = '';
    model.value.problem = '';
    model.value.product_id = '';
    model.value.description = '';
    model.value.quantity = '';
    model.value.cost = '';
  }
};

onMounted(async () => {
  if (productStore.productOptions.length === 0) {
    await productStore.fetchAllProducts();
  }
});
</script>
