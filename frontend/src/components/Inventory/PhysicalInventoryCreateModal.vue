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
        v-model="model.date"
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

const showModal = defineModel();
const model = ref({
  date: "",
});

const physicalInventoryStore = usePhysicalInventoryStore();

const onSubmit = async () => {
  console.log("here");
  const res = await authenticatedApi(
    `physical-inventory/register`,
    Method.POST,
    model.value
  );

  if (res.status == 200) {
    showModal.value = false;
    await physicalInventoryStore.fetchAllPhysicalInventories();

    // TODO: Redirect to the details the form for the product items
  }

  // show errors here
};
</script>
