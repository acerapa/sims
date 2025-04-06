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
      <CustomInput
        type="select"
        :has-label="true"
        label="Products"
        name="included-products"
        :options="productOptions"
        v-model="model.products"
        @add-new="onAddNewProduct"
        placeholder="Select included products"
        :has-add-new="true"
        :can-search="true"
        :select-multiple="true"
        :error="modelErrors.products"
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
import { onMounted, computed, ref, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import { useSettingsStore } from '@/stores/settings'
import { ObjectHelpers, ProductReorderSchema } from 'shared'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import { useRouter } from 'vue-router'
import { InventoryConst, SettingConst } from '@/const/route.constants'
import { useAppStore } from '@/stores/app'
import { ModalStateConst } from '@/const/state.constants'
import { useValidation } from '@/composables/useValidation'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const showModal = defineModel()
const showConfirmModal = ref(false)

const router = useRouter()
const appStore = useAppStore()
const productStore = useProductStore()
const settingStore = useSettingsStore()

const model = ref({
  point: '',
  products: []
})

const modelErrors = ref({})

// composables
const { errors, hasErrors, validateData } = useValidation(
  ProductReorderSchema,
  model.value
)

/** ================================================
 * COMPUTED
 ** ================================================*/

const productOptions = computed(() => {
  return productStore.products.map((product) => {
    return {
      value: product.id,
      text: product.name
    }
  })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validations
  validateData()
  if (hasErrors.value) return

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

const onAddNewProduct = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: {
      redirect: 'product-settings'
    }
  })
}

const setPointModalState = () => {
  appStore.setModalState(ModalStateConst.PRODUCT_POINT_MODAL, {
    state: model.value,
    route_scope: [SettingConst.PRODUCT_SETTINGS, InventoryConst.PRODUCT_FORM]
  })
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await productStore.fetchAllProducts()
  if (props.selectedId) {
    let orderingPoint = settingStore.productReorderingPoints.find(
      (point) => point.id == props.selectedId
    )

    if (orderingPoint) {
      model.value.point = orderingPoint.point
      model.value.products = orderingPoint.product_details.map(
        (pd) => pd.product.id
      )
    }
  }

  if (appStore.isModalExist(ModalStateConst.PRODUCT_POINT_MODAL)) {
    if (
      !ObjectHelpers.compareObjects(
        model.value,
        appStore.modals[ModalStateConst.PRODUCT_POINT_MODAL].state
      )
    ) {
      model.value = ObjectHelpers.assignSameFields(
        model.value,
        appStore.modals[ModalStateConst.PRODUCT_POINT_MODAL].state
      )
    }
  } else {
    setPointModalState()
  }
})

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value,
  () => {
    setPointModalState()
  },
  { deep: true }
)
</script>
