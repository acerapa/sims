<template>
  <div
    class="flex flex-col gap-1 relative"
    v-if="props.type != 'textarea' && props.type != 'select'"
  >
    <small v-if="props.hasLabel">{{ props.label }}</small>
    <input
      :type="props.type"
      :name="props.name"
      :id="props.id ? props.id : props.name"
      :class="['input', props.inputClass, props.error ? 'border-red-500' : '']"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      v-model="value"
      @input="emit('input')"
      @focus="emit('focus')"
      @change="emit('change')"
    />
    <small class="error" v-if="props.error">{{ props.error }}</small>
  </div>
  <div class="flex flex-col gap-1 relative" v-if="props.type == 'textarea'">
    <small v-if="props.hasLabel">{{ props.label }}</small>
    <textarea
      :name="props.name"
      :id="props.id ? props.id : props.name"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="['input', props.inputClass, props.error ? 'border-red-500' : '']"
      v-model="value"
      @input="emit('input')"
      @focus="emit('focus')"
      @change="emit('change')"
    ></textarea>
    <small class="error" v-if="props.error">{{ props.error }}</small>
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
      v-model="value"
      @input="emit('input')"
      @focus="emit('focus')"
      @change="emit('change')"
    />
  </div>
</template>

<script setup>
import CustomSelectInput from "./CustomSelectInput.vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  id: {
    type: String,
    required: false,
  },
  inputClass: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  hasLabel: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  error: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hasAddNew: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    required: false,
  },
  selectMultiple: {
    type: Boolean,
    default: false,
  },
  canSearch: {
    type: Boolean,
    default: false,
  },
});

// custom props validation
if (props.type == "select" && !props.options) {
  console.warn("Select type CustomInput must have options props");
}

const value = defineModel();
const emit = defineEmits(["focus", "change", "input"]);
</script>

<style scoped>
.error {
  bottom: -18px;
  color: #ef4444;
  position: absolute;
}
</style>
