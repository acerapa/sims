<template>
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
        :options="productOptions"
        :has-add-new="true"
        @add-new="showModal = true"
        v-model="product.product_id"
        :key="product.product_id"
        :can-search="true"
        :disabled="props.isDisabled"
      />
    </div>
    <CustomInput
      type="text"
      class="col-span-3"
      name="description"
      placeholder="Description"
      :disabled="props.isDisabled"
      v-model="product.description"
    />
    <CustomInput
      type="number"
      name="quantity"
      class="col-span-1"
      placeholder="quantity"
      v-model="product.quantity"
      :disabled="props.isDisabled"
    />
    <CustomInput
      name="cost"
      type="number"
      class="col-span-1"
      placeholder="Cost"
      v-model="product.cost"
      :disabled="props.isDisabled"
    />
    <CustomInput
      type="number"
      name="amount"
      class="col-span-1"
      placeholder="Amount"
      v-model="product.amount"
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
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useProductStore } from "@/stores/product";
import ProductModal from "@/components/Product/ProductModal.vue";
import CustomInput from "@/components/shared/CustomInput.vue";
import { getCost } from "@/helper";

const props = defineProps({
  selectedProducts: {
    type: Array,
    defualt: [],
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  sup_id: {
    type: String,
  },
});

const product = defineModel();
const showModal = ref(false);
const emit = defineEmits(["remove"]);
const productStore = useProductStore();
const productOptions = computed(() => {
  return productStore.supplierProducts
    .map((product) => {
      return {
        text: product.name,
        value: product.id,
      };
    })
    .filter((prod) => {
      if (product.value.product_id == prod.value) return true;
      return !props.selectedProducts
        .map((p) => p.product_id)
        .includes(prod.value);
    });
});

watch(
  () => product.value.product_id,
  (val) => {
    const prd = productStore.products.find((product) => product.id == val);
    if (prd) {
      product.value.product_id = prd.id;
      product.value.name = prd.name;
      product.value.description = product.value.description
        ? product.value.description
        : prd.purchase_description;
      product.value.quantity = product.value.quantity
        ? product.value.quantity
        : 1; // will always set quantity upon create
      product.value.cost = getCost(product.value.cost, prd, props.sup_id);
    }
  }
);

watch(
  () => [product.value.quantity, product.value.cost],
  (val) => {
    if (val) {
      product.value.amount = product.value.cost * product.value.quantity;
    }
  }
);
</script>
