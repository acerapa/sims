<template>
  <ModalWrapper
    title="New Physical Inventory"
    v-model="showModal"
    @submit="onSubmit"
  >
    <div class="pt-7 flex flex-col gap-3">
      <CustomInput
        name="date"
        placeholder="Date"
        type="date"
        :has-label="true"
        v-model="model.physical_inventory.date"
        label="Physical Inventory for date?"
      />
    </div>
  </ModalWrapper>
</template>

<script setup>
import ModalWrapper from "../shared/ModalWrapper.vue";
import CustomInput from "../shared/CustomInput.vue";
import { authenticatedApi, Method } from "@/api";
import { ref } from "vue";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/product";

const items = ref([]);
const router = useRouter();
const showModal = defineModel();
const model = ref({
  physical_inventory: {
    date: "",
  },
  items: [],
});

const productStore = useProductStore();
const physicalInventoryStore = usePhysicalInventoryStore();

const onSubmit = async () => {
  await productStore.fetchAllProducts();
  model.value.items = productStore.products.map((product) => {
    return {
      product_id: product.id,
      physical_quantity: 0,
      physical_inventory_id: 0,
    };
  });

  const res = await authenticatedApi(
    `physical-inventory/register`,
    Method.POST,
    model.value
  );

  if (res.status == 200) {
    showModal.value = false;
    await physicalInventoryStore.fetchAllPhysicalInventories();

    // TODO: Redirect to the details the form for the product items
    router.push({
      name: "physical-inventory-details",
      params: {
        id: res.data.physical_inventory.id,
      },
    });
  }

  // show errors here
};
</script>
