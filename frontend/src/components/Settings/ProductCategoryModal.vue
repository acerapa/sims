<template>
  <ModalWrapper
    title="New Category"
    v-model="showModal"
    @submit="onSubmit"
    :has-delete="props.selectedId ? true : false"
    @delete="onDelete"
  >
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
  <DeleteConfirmModal
    v-if="showConfirmModal"
    v-model="showConfirmModal"
    @after-delete="onAfterDelete"
    :href="`product-category/delete/${props.selectedId}`"
  />
</template>
<script setup>
import { Method, authenticatedApi } from '@/api'
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { useSettingsStore } from '@/stores/settings'
import { onMounted, ref } from 'vue'

const showModal = defineModel()
const showConfirmModal = ref(false)
const settingsStore = useSettingsStore()

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const model = ref({
  name: ''
})

onMounted(async () => {
  if (props.selectedId) {
    model.value = settingsStore.productCategories.find(
      (pc) => pc.id == props.selectedId
    )
  }
})

const apiPath = props.selectedId
  ? 'product-category/update'
  : 'product-category/register'

const onSubmit = async () => {
  const res = await authenticatedApi(apiPath, Method.POST, model.value)

  if (res.status == 200) {
    showModal.value = false
  }

  await settingsStore.fetchAllProductCategories()
}

const onDelete = async () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  showConfirmModal.value = false
  await settingsStore.fetchAllProductCategories()
}
</script>
