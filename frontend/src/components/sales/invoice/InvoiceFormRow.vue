<template>
  <div
    class="grid gap-3 min-w-[1295px] items-center"
    :class="props.isDisabled ? 'grid-cols-12' : 'grid-cols-13'"
  >
    <CustomInput
      type="select"
      name="product_id"
      class="col-span-5"
      :can-search="true"
      v-model="model.product_id"
      placeholder="Select Product"
      :has-add-new="true"
      @add-new="onAddNew"
      :options="productOptions"
      :error-has-text="false"
      :disabled="props.isDisabled"
      :error="modelErrors.product_id"
    />

    <CustomInput
      type="text"
      name="serial_number"
      class="col-span-3"
      input-class="w-full"
      v-model="model.serial_number"
      placeholder="Serial Number"
      :error-has-text="false"
      :disabled="props.isDisabled"
      :error="modelErrors.serial_number"
    />

    <div class="col-span-1">
      <CustomInput
        v-if="!props.isDisabled"
        type="number"
        name="quantity"
        class="col-span-1"
        v-model="model.quantity"
        placeholder=""
        input-class="w-full"
        :error-has-text="false"
        :disabled="props.isDisabled"
        :error="modelErrors.quantity"
      />
      <p class="text-sm text-center" v-if="props.isDisabled">
        {{ model.quantity }}
      </p>
    </div>

    <div class="col-span-1">
      <CustomInput
        type="number"
        name="price"
        :icon="peso"
        v-if="!props.isDisabled"
        class="col-span-1"
        placeholder="Price"
        input-class="w-full"
        v-model="model.price"
        :error-has-text="false"
        :error="modelErrors.price"
        :disabled="props.isDisabled"
      />
      <p class="text-sm text-end" v-if="props.isDisabled">
        ₱ {{ model.price }}
      </p>
    </div>

    <div class="col-span-1">
      <CustomInput
        :icon="peso"
        type="number"
        name="discount"
        class="col-span-1"
        input-class="w-full"
        placeholder="Discount"
        v-if="!props.isDisabled"
        v-model="model.discount"
        :error-has-text="false"
        :disabled="props.isDisabled"
        :error="modelErrors.discount"
      />

      <p class="text-sm text-end" v-if="props.isDisabled">
        ₱ {{ model.discount }}
      </p>
    </div>

    <div class="col-span-1">
      <CustomInput
        name="total"
        :icon="peso"
        type="number"
        class="col-span-1"
        placeholder="Total"
        input-class="w-full"
        v-model="model.total"
        :error-has-text="false"
        v-if="!props.isDisabled"
        :error="modelErrors.total"
        :disabled="props.isDisabled"
      />
      <p class="text-sm text-end" v-if="props.isDisabled">
        ₱ {{ model.total }}
      </p>
    </div>

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
import CustomInput from '@/components/shared/CustomInput.vue'
import { computed, onMounted, ref, watch } from 'vue'
import Event from '@/event'
import { useRouter } from 'vue-router'
import { InventoryConst, SalesConst } from '@/const/route.constants'
import peso from '@/assets/icons/peso.png'

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
