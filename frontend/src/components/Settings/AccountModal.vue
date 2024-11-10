<template>
  <ModalWrapper title="New Account" @submit="onSubmit" v-model="showModal">
    <div class="flex gap-3 my-7">
      <input
        type="text"
        class="input flex-1"
        placeholder="Name"
        v-model="model.name"
      />
      <select name="" id="" class="input flex-1" v-model="model.type">
        <option value="">Select Account Type</option>
        <option value="income">Income Account</option>
        <option value="expense">Expense Account</option>
        <option value="asset">Asset Account</option>
      </select>
    </div>
  </ModalWrapper>
</template>

<script setup>
import { Method, authenticatedApi } from '@/api';
import ModalWrapper from '@/components/shared/ModalWrapper.vue';
import { useSettingsStore } from '@/stores/settings';
import { onMounted, ref } from 'vue';

const settingsStore = useSettingsStore();
const model = ref({
  name: '',
  type: '',
});

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  selectedId: {
    type: Number,
  },
});

const showModal = defineModel();

const apiPath = props.isEdit
  ? 'settings/accounts/update'
  : 'settings/accounts/register';

onMounted(() => {
  if (props.isEdit && props.selectedId) {
    model.value = settingsStore.accounts.find(
      (acc) => acc.id == props.selectedId,
    );
  }
});

const onSubmit = async () => {
  const res = await authenticatedApi(apiPath, Method.POST, model.value);
  showModal.value = false;

  await settingsStore.fetchAllAccounts();
};
</script>
