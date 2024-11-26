<template>
  <div>
    <div
      class="flex flex-col gap-1 relative"
      v-if="props.type != 'textarea' && props.type != 'select'"
    >
      <small v-if="props.hasLabel">{{ props.label }}</small>
      <input
        :type="props.type"
        :name="props.name"
        :id="props.id ? props.id : props.name"
        :class="[
          'input',
          props.inputClass,
          props.error ? 'border-red-500' : ''
        ]"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        v-model="value"
        @input="emit('input')"
        @focus="emit('focus')"
        @blur="emit('blur')"
        @change="emit('change')"
        @reset="emit('reset')"
      />
      <small class="error" v-if="props.errorHasText">{{ props.error }}</small>
    </div>
    <div class="flex flex-col gap-1 relative" v-if="props.type == 'textarea'">
      <small v-if="props.hasLabel">{{ props.label }}</small>
      <textarea
        :name="props.name"
        :id="props.id ? props.id : props.name"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :rows="props.rows"
        :cols="props.cols"
        :class="[
          'input',
          props.inputClass,
          props.error ? 'border-red-500' : ''
        ]"
        v-model="value"
        @input="emit('input')"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @change="emit('change')"
        @reset="emit('reset')"
      ></textarea>
      <small class="error" v-if="props.errorHasText">{{ props.error }}</small>
    </div>
    <div class="flex flex-col gap-1 relative" v-if="props.type == 'select'">
      <small v-if="props.hasLabel">{{ props.label }}</small>
      <CustomSelectInput
        :name="props.name"
        :options="props.options"
        :disabled="props.disabled"
        :can-search="props.canSearch"
        :has-add-new="props.hasAddNew"
        :placeholder="props.placeholder"
        :id="props.id ? props.id : props.name"
        :select-multiple="props.selectMultiple"
        :class="
          props.error
            ? '[&>div>*]:border [&>div>*]:border-red-500 [&>select]:border [&>select]:border-red-500'
            : ''
        "
        v-model="value"
        @input="emit('input')"
        @focus="emit('focus')"
        @change="emit('change')"
        @blur="emit('blur')"
        @reset="emit('reset')"
        @add-new="emit('addNew')"
      />
      <small class="error" v-if="props.errorHasText">{{ props.error }}</small>
    </div>
  </div>
</template>

<script setup>
import CustomSelectInput from './CustomSelectInput.vue'
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
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
  },
  hasLabel: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String
  },
  errorHasText: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hasAddNew: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    required: false
  },
  selectMultiple: {
    type: Boolean,
    default: false
  },
  canSearch: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 2
  },
  cols: {
    type: Number,
    default: 20
  }
})

// custom props validation
if (props.type == 'select' && !props.options) {
  console.warn('Select type CustomInput must have options props')
}

const value = defineModel()
const emit = defineEmits([
  'focus',
  'change',
  'input',
  'reset',
  'blur',
  'addNew'
])
</script>

<style scoped>
.error {
  bottom: -18px;
  color: #ef4444;
  position: absolute;
}
</style>
