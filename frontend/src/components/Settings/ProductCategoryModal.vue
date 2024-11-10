<template>
  <ModalWrapper title="New Category" v-model="showModal" @submit="onSubmit">
    <div class="flex mt-7">
      <CustomInput
        type="text"
        name="category"
        v-model="model.name"
        class="flex-1"
        placeholder="Category Name"
      />
    </div>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from '@/api';
import CustomInput from '@/components/shared/CustomInput.vue';
import ModalWrapper from '@/components/shared/ModalWrapper.vue';
import { useSettingsStore } from '@/stores/settings';
import { onMounted, ref } from 'vue';

const showModal = defineModel();
const settingsStore = useSettingsStore();

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

const model = ref({
  name: '',
});

onMounted(async () => {
  if (props.isEdit && props.selectedId) {
    model.value = settingsStore.productCategories.find(
      (pc) => pc.id == props.selectedId,
    );
  }
});

const apiPath = props.isEdit
  ? 'product-category/update'
  : 'product-category/register';

const onSubmit = async () => {
  const res = await authenticatedApi(apiPath, Method.POST, model.value);

  if (res.status == 200) {
    showModal.value = false;
  }

  await settingsStore.fetchAllProductCategories();
};
</script>
