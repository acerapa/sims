<template>
  <ModalWrapper
    title="Cancel Confirmation"
    save-btn="Confirm"
    @submit="onSubmit"
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
import { authenticatedApi, Method } from '@/api'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
const showModal = defineModel()

const props = defineProps({
  href: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['afterUpdate'])
const purchaseOrderStore = usePurchaseOrderStore()

const onSubmit = async () => {
  await authenticatedApi(props.href, Method.POST, props.data)
  await purchaseOrderStore.fetchPurchaseOrders()
  showModal.value = false
}
</script>
