<template>
  <ProductModal v-model="showModal" v-if="showModal" />
  <div class="grid grid-cols-9 gap-3 items-start min-w-[750px]">
    <div class="col-span-2 flex gap-3">
      <input type="checkbox" class="input flex-shrink-0 mt-[10px]" />
      <CustomSelectInput
        class="w-full [&>select]:w-full"
        placeholder="Select product"
        :options="productOptions"
        :has-add-new="true"
        @add-new="showModal = true"
        v-model="order.id"
        :can-search="true"
      />
    </div>
    <input class="col-span-3 input" v-model="order.description" />
    <input class="col-span-1 input" type="number" v-model="order.quantity" />
    <input class="col-span-1 input" type="number" v-model="order.cost" />
    <input class="col-span-1 input" v-model="order.amount" />
    <p class="col-span-1 text-sm pl-3 mt-[10px]">
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
import { computed, onMounted, ref, watch } from "vue";
import CustomSelectInput from "../shared/CustomSelectInput.vue";
import { useProductStore } from "@/stores/product";
import ProductModal from "../Product/ProductModal.vue";

const props = defineProps({
  selectedProducts: {
    type: Array,
    defualt: [],
  },
});

const order = defineModel();
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
      if (order.value.id == prod.value) return true;
      return !props.selectedProducts.map((p) => p.id).includes(prod.value);
    });
});

onMounted(async () => {
  await productStore.fetchAllProducts();
});

watch(
  () => order.value.id,
  (val) => {
    const product = productStore.products.find((product) => product.id == val);
    if (product) {
      order.value.id = product.id;
      order.value.name = product.name;
      order.value.description = product.purchase_description;
      order.value.quantity = 1; // will always set quantity upon create
      if (product.suppliers.length) {
        order.value.cost = product.suppliers[0].ProductSupplier.cost;
      }
    }
  }
);

watch(
  () => [order.value.quantity, order.value.cost],
  (val) => {
    if (val) {
      order.value.amount = order.value.cost * order.value.quantity;
    }
  }
);
</script>
