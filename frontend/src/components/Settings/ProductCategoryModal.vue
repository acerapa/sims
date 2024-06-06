<template>
  <ModalWrapper title="New Category" v-model="showModal" @submit="onSubmit">
    <div class="flex mt-7">
      <input
        type="text"
        class="input flex-1"
        placeholder="Category Name"
        v-model="model.name"
      />
    </div>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/wrappers/ModalWrapper.vue";
import { useSettingsStore } from "@/stores/settings";
import { ref } from "vue";

const showModal = defineModel();
const settingsStore = useSettingsStore();

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedId: {
    type: Number,
  },
});

const model = ref({
  name: "",
});

const apiPath = props.isEdit
  ? "product-category/update"
  : "product-category/register";

const onSubmit = async () => {
  await authenticatedApi(apiPath, Method.POST, model.value);

  await settingsStore.fetchAllProductCategories();
};
</script>
