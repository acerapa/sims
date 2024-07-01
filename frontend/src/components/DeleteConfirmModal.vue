<template>
  <ModalWrapper
    title="Delete Confirmation"
    save-btn="Confirm"
    @submit="submit"
    v-model="showModal"
  >
    <p class="font-semibold text-lg mx-auto my-7 text-center">
      This action is irreversible do you want to continue?
    </p>
  </ModalWrapper>
</template>
<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/shared/ModalWrapper.vue";
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

const emit = defineEmits(["afterDelete"]);

const submit = async () => {
  await authenticatedApi(props.href, Method.DELETE, props.data);
  emit("afterDelete");
};
</script>
