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
import DeleteConfirmModal from '../DeleteConfirmModal.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { useSettingsStore } from '@/stores/settings'
import { onMounted, ref } from 'vue'
import { CategorySchema } from 'shared'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'

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

const title = ref(
  props.general_cat
    ? `New Sub Category`
    : props.selectedId
      ? 'Edit Category'
      : 'New Category'
)

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

  if (props.general_cat) {
    await settingsStore.getProductCategories()
    const parentCat = settingsStore.getProductCategoryByIdSync(
      props.general_cat
    )

    if (parentCat) {
      title.value = `New Sub Category for ${parentCat.name}`
    }
  }
})

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

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await settingsStore.updateProductCategory(
      props.selectedId,
      model.value
    )
  } else {
    isSuccess = await settingsStore.registerProductCategory(model.value)
  }

  if (isSuccess) {
    showModal.value = false
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${props.selectedId ? 'updated' : 'created'} category!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${props.selectedId ? 'update' : 'create'} category!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
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
