<template>
  <ModalWrapper
    title="Delete Confirmation"
    save-btn="Confirm"
    @submit="submit"
    v-model="showModal"
  >
    <div class="mx-auto text-center mt-7 mb-4 flex flex-col gap-4">
      <img
        src="@/assets/icons/exclamation.svg"
        alt="notice"
        class="block mx-auto w-15 h-15"
      />
      <p class="font-semibold text-lg">
        This action is irreversible do you want to continue?
      </p>
    </div>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from '@/api';
import ModalWrapper from '@/components/shared/ModalWrapper.vue';
const showModal = defineModel();

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['afterDelete']);

const submit = async () => {
  await authenticatedApi(props.href, Method.DELETE, props.data);
  showModal.value = false;
  emit('afterDelete');
};
</script>
