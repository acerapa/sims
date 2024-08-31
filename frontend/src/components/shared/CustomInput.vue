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
      :class="['input', props.inputClass, props.error ? 'border-red-500' : '']"
      @input="emit('input')"
      @focus="emit('focus')"
      @change="emit('change')"
    ></textarea>
    <small class="error" v-if="props.error">{{ props.error }}</small>
  </div>
</template>

<script setup>
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
});

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
