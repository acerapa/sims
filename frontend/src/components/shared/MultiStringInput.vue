<template>
  <form
    tabindex="0"
    @submit.prevent="onSubmit"
    class="input-multi-string group"
  >
    <div class="flex gap-3 flex-wrap" v-if="model.length">
      <div
        class="multi-string-item"
        v-for="(item, ndx) in model"
        :key="`${item} - ${ndx}`"
      >
        {{ item }}
        <button type="button" @click="removeItem(ndx)">
          <img src="@/assets/icons/close.svg" alt="close" />
        </button>
      </div>
    </div>
    <input
      type="text"
      :id="props.id"
      :name="props.name"
      class="input-custom"
      v-model="partialModel"
      :class="props.inputClass"
      :placeholder="props.placeholder"
    />
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: false
  },
  inputClass: {
    type: String,
    required: false
  },
  placeholder: {
    type: String,
    required: false
  }
})

console.log('here')

const partialModel = ref()
const model = defineModel()

const onSubmit = () => {
  model.value.push(partialModel.value)
  partialModel.value = ''
}

const removeItem = (ndx) => {
  model.value.splice(ndx, 1)
}
</script>

<style scoped>
.input-custom {
  @apply outline-none flex-1;
}

.input-multi-string {
  @apply rounded outline 
			outline-1 outline-default-gray
			focus:outline-black
			focus-within:outline-black
			text-sm px-3 py-2 flex flex-col gap-3;
}

.multi-string-item {
  @apply bg-gray-100 flex gap-2 rounded px-2 py-1 items-center text-gray-600;
}
</style>
