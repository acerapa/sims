<template>
  <ModalWrapper
    :title="title"
    @delete="onDelete"
    @submit="onSubmit"
    v-model="showModal"
    :has-delete="props.selectedId ? true : false"
  >
    <div class="flex mt-7 pb-5">
      <CustomInput
        type="text"
        class="flex-1"
        name="category"
        :has-label="true"
        v-model="model.name"
        label="Category Name"
        :error-has-text="true"
        :error="modelError.name"
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
import { CategorySchema } from 'shared'

const showModal = defineModel()
const showConfirmModal = ref(false)
const settingsStore = useSettingsStore()

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  },
  general_cat: {
    type: Number,
    required: false
  }
})

const title = props.general_cat
  ? 'New Sub Category'
  : props.selectedId
    ? 'Edit Category'
    : 'New Category'

const model = ref({
  name: '',
  general_cat: props.general_cat
})
const modelError = ref({})

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
  // validations
  const { error } = CategorySchema.options({ allowUnknown: true }).validate(
    model.value
  )

  if (error) {
    error.details.forEach((err) => {
      modelError.value[err.context.key] = err.message
    })
    return
  }

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
