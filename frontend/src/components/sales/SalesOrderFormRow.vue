<template>
  <div
    class="grid gap-3"
    :class="props.isDisabled ? 'grid-cols-9' : 'grid-cols-10'"
  >
    <CustomInput
      type="select"
      class="col-span-2"
      name="product_id"
      v-model="model.product_id"
      placeholder="Select Product"
      :has-add-new="true"
      @add-new=""
      :options="productOptions"
      :error-has-text="false"
      :error="modelErrors.product_id"
    />

    <CustomInput
      type="text"
      class="col-span-3"
      name="description"
      v-model="model.description"
      placeholder="Item Description"
      :error-has-text="false"
      :error="modelErrors.description"
    />

    <CustomInput
      type="number"
      name="quantity"
      class="col-span-1"
      v-model="model.quantity"
      placeholder=""
      :error-has-text="false"
      :error="modelErrors.quantity"
    />

    <CustomInput
      type="number"
      name="price"
      class="col-span-1"
      placeholder="Price"
      v-model="model.price"
      :error-has-text="false"
      :error="modelErrors.price"
    />
    <CustomInput
      type="number"
      name="discount"
      class="col-span-1"
      placeholder="Discount"
      v-model="model.discount"
      :error-has-text="false"
      :error="modelErrors.discount"
    />
    <CustomInput
      type="number"
      name="total"
      class="col-span-1"
      placeholder="Total"
      v-model="model.total"
      :error-has-text="false"
      :error="modelErrors.total"
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

const emit = defineEmits(['emit'])
const productStore = useProductStore()
const model = defineModel()
const modelErrors = ref({})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(props.eventName, (data) => {
  modelErrors.value = data ? data : {}
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const productOptions = computed(() => {
  return productStore.products
    .map((product) => {
      return {
        text: product.name,
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
 * WATCHERS
 ** ================================================*/
watch(
  () => model.value.product_id,
  (val) => {
    const prd = productStore.products.find((p) => p.id == val)
    if (prd) {
      model.value.description = prd.product_details.sales_description
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
