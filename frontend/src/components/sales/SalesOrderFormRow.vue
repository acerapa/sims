<template>
  <div
    class="grid gap-3 min-w-[864px]"
    :class="props.isDisabled ? 'grid-cols-11' : 'grid-cols-12'"
  >
    <CustomInput
      type="select"
      class="col-span-5"
      name="product_id"
      v-model="model.product_id"
      placeholder="Select Product"
      :has-add-new="true"
      :can-search="true"
      @add-new="onAddNew"
      :options="productOptions"
      :error-has-text="false"
      :disabled="props.isDisabled"
      :error="modelErrors.product_id"
    />

    <CustomInput
      type="text"
      name="serial_no"
      class="col-span-2"
      v-model="model.serial_number"
      placeholder="Serial No."
      :error-has-text="false"
      :disabled="props.isDisabled"
      :error="modelErrors.serial_number"
    />

    <CustomInput
      type="number"
      name="quantity"
      class="col-span-1"
      v-model="model.quantity"
      placeholder=""
      :error-has-text="false"
      :disabled="props.isDisabled"
      :error="modelErrors.quantity"
    />

    <CustomInput
      type="number"
      name="discount"
      class="col-span-1"
      v-model="model.discount"
      placeholder=""
      :error-has-text="false"
      :disabled="props.isDisabled"
      :error="modelErrors.discount"
    />

    <CustomInput
      type="number"
      name="price"
      class="col-span-1"
      placeholder="Price"
      v-model="model.price"
      :error-has-text="false"
      :error="modelErrors.price"
      :disabled="props.isDisabled"
    />
    <CustomInput
      type="number"
      name="total"
      class="col-span-1"
      placeholder="Total"
      v-model="model.total"
      :error-has-text="false"
      :error="modelErrors.total"
      :disabled="props.isDisabled"
    />
    <p
      class="col-span-1 text-sm pl-3 mt-[10px]"
      :class="[props.isDisabled ? 'hidden' : '']"
    >
      <img
        @click="emit('remove')"
        src="@/assets/icons/remove.svg"
        class="cursor-pointer w-5 h-5"
        alt="remove"
      />
    </p>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product'
import CustomInput from '../shared/CustomInput.vue'
import { computed, onMounted, ref, watch } from 'vue'
import Event from '@/event'
import { useRouter } from 'vue-router'
import { InventoryConst, SalesConst } from '@/const/route.constants'

const props = defineProps({
  ndx: {
    type: Number,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  eventName: {
    type: String,
    required: false
  },
  selected: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const emit = defineEmits(['emit'])
const productStore = useProductStore()
const model = defineModel()
const modelErrors = ref({})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(
  props.eventName,
  (data) => {
    if (data && data[props.ndx]) {
      modelErrors.value = data[props.ndx]
    } else {
      modelErrors.value = {}
    }
  },
  true
)

/** ================================================
 * COMPUTED
 ** ================================================*/
const productOptions = computed(() => {
  return productStore.products
    .map((product) => {
      return {
        text: product.product_details.sales_description,
        value: product.id
      }
    })
    .filter((prod) => {
      if (model.value.product_id == prod.value) return true
      return !props.selected.map((p) => p.product_id).includes(prod.value)
    })
})

onMounted(async () => {
  await productStore.getProducts()
})

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNew = () => {
  router.push({
    name: InventoryConst.PRODUCT_FORM,
    query: {
      redirect: SalesConst.SALES_ORDER_FORM
    }
  })
}

/** ================================================
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value.product_id,
  (val) => {
    const prd = productStore.products.find((p) => p.id == val)
    if (prd) {
      model.value.price = prd.price
      model.value.quantity = 1
    }
  }
)

watch(
  () => [model.value.quantity, model.value.price],
  () => {
    model.value.total = model.value.quantity * model.value.price
  }
)
</script>
