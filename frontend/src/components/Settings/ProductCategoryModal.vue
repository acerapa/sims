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
        :error="errors.name"
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
import { useValidation } from '@/composables/useValidation'

const showModal = defineModel()
const showConfirmModal = ref(false)
const settingsStore = useSettingsStore()


const emit = defineEmits(['id'])
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

// composables
const { errors, hasErrors, validateData } = useValidation(
  CategorySchema,
  model.value
)

onMounted(async () => {
  await settingsStore.getProductCategories()
  if (props.selectedId) {
    const category = await settingsStore.findCategoryInHierarchy(
      props.selectedId
    )

    if (category) {
      model.value.name = category.name
      model.value.general_cat = category.general_cat

      if (category.general_cat) {
        const parentCat = await settingsStore.findCategoryInHierarchy(
          category.general_cat
        )

        if (parentCat) {
          if (props.selectedId) {
            title.value = `New Sub Category for ${parentCat.name}`
          } else {
            title.value = `Edit Sub Category for ${parentCat.name}`
          }
        }
      }
    }
  }
})

const onSubmit = async () => {
  // validations
  validateData()
  if (hasErrors.value) return

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await settingsStore.updateProductCategory(
      props.selectedId,
      model.value
    )
  } else {
    const res = await settingsStore.registerProductCategory(model.value)
    isSuccess = res.isSuccess
    emit('id', res.data.id)
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
  await settingsStore.removeProductCategory({
    id: props.selectedId,
    general_cat: model.value.general_cat
  })
}
</script>
