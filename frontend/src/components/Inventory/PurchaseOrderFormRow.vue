<template>
  <ProductModal v-model="showModal" v-if="showModal" />
  <div class="grid grid-cols-9 gap-3 items-center min-w-[750px]">
    <div class="col-span-2 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <CustomSelectInput
        class="w-full [&>select]:w-full"
        placeholder="Select product"
        :options="productOptions"
        :has-add-new="true"
        @add-new="showModal = true"
        v-model="order.id"
      />
    </div>
    <input class="col-span-3 input" v-model="order.description" />
    <input class="col-span-1 input" type="number" v-model="order.quantity" />
    <input class="col-span-1 input" type="number" v-model="order.cost" />
    <input class="col-span-1 input" v-model="order.amount" />
    <p class="col-span-1 text-sm pl-3">
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

const order = defineModel();
const showModal = ref(false);
const emit = defineEmits(["remove"]);
const productStore = useProductStore();

const productOptions = computed(() => {
  return productStore.supplierProducts.map((product) => {
    return {
      text: product.name,
      value: product.id,
    };
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
      if (product.suppliers.length) {
        order.value.cost = product.suppliers[0].ProductSupplier.cost;
      }
    }
  }
);

watch(
  () => order.value.quantity,
  (val) => {
    if (val) {
      order.value.amount = order.value.cost * val;
    }
  }
);
</script>
