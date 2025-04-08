<template>
  <ModalWrapper
    v-model="showModal"
    :title="props.selectedId ? 'Edit Re-ordering Point' : 'New Ordering Point'"
    modal-class="[&>form>div]:overflow-visible"
    :has-delete="props.selectedId ? true : false"
    @submit="onSubmit"
    @delete="onDelete"
  >
    <div class="flex flex-col gap-5">
      <CustomInput
        name="points"
        type="number"
        class="mt-6"
        :has-label="true"
        label="Reordering Point"
        placeholder="Re-ordering Points"
        v-model="model.point"
        :error="errors.point"
        :error-has-text="true"
      />
    </div>
  </ModalWrapper>
  <DeleteConfirmModal
    v-if="showConfirmModal"
    v-model="showConfirmModal"
    :href="`product-setting/delete/${props.selectedId}`"
    @after-delete="onAfterDelete"
  />
</template>
<script setup>
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { ProductReorderSchema } from 'shared'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useValidation } from '@/composables/useValidation'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const showModal = defineModel()
const showConfirmModal = ref(false)

const settingStore = useSettingsStore()

const model = ref({
  point: ''
})

// composables
const { errors, hasErrors, validateData } = useValidation(
  ProductReorderSchema,
  model.value
)

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validations
  validateData()
  if (hasErrors.value) {
    return
  }

  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await settingStore.updateReorderingPoint(
      props.selectedId,
      model.value
    )
  } else {
    isSuccess = await settingStore.registerReorderingPoint(model.value)
  }

  if (isSuccess) {
    showModal.value = false
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${props.selectedId ? 'updated' : 'created'} re-ordering point!`,
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${props.selectedId ? 'update' : 'create'} re-ordering point!`,
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

const onDelete = () => {
  showConfirmModal.value = true
}

const onAfterDelete = async () => {
  showModal.value = false
  showConfirmModal.value = false
  await settingStore.fetchAllProductReorderingPoints()
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  if (props.selectedId) {
    let orderingPoint = settingStore.productReorderingPoints.find(
      (point) => point.id == props.selectedId
    )

    if (orderingPoint) {
      model.value.point = orderingPoint.point
    }
  }
})
</script>
