<template>
  <div class="flex flex-col">
    <select
      class="input flex-1"
      v-model="selected"
      ref="select"
      v-if="!props.selectMultiple"
    >
      <option value="" v-if="props.placeholder" selected disabled>
        {{ props.placeholder }}
      </option>
      <option value="add-new" v-if="props.hasAddNew">
        &lt;&lt;Add New&gt;&gt;
      </option>
      <option
        v-for="(option, ndx) in props.options"
        :key="ndx"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>

    <div class="relative group z-10" tabindex="0">
      <div class="input min-h-[38px] relative z-10" v-if="props.selectMultiple">
        <p v-if="props.placeholder && !selected.length">
          {{ props.placeholder }}
        </p>
        <div id="selected" class="flex gap-2 flex-wrap" v-if="selected.length">
          <div
            class="flex gap-1 bg-blue-100 px-2 rounded w-fit items-center"
            v-for="(sl, ndx) in selected"
            :key="ndx"
          >
            <span class="text-xs">{{ getName(sl) }}</span>
            <button
              type="button"
              class="text-danger"
              @click="removeSelectedValue(sl)"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
      <div class="dropdown">
        <p v-if="props.hasAddNew" class="dropdown-item" @click="emit('addNew')">
          &lt;&lt;Add New&gt;&gt;
        </p>
        <p
          class="dropdown-item"
          v-for="(opt, ndx) in multiSelectOptions"
          :key="ndx"
          @click="onSelectOpt(opt.value)"
        >
          {{ opt.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const emit = defineEmits(["addNew"]);

const props = defineProps({
  placeholder: {
    type: String,
    required: false,
  },
  hasAddNew: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    required: true,
  },
  selectMultiple: {
    type: Boolean,
    default: false,
  },
});

const selected = defineModel();
const select = ref();

const getName = (value) => {
  return props.options.find((opt) => opt.value == value).text;
};

const onSelectOpt = (value) => {
  selected.value.push(value);
};

const removeSelectedValue = (value) => {
  selected.value = selected.value.filter((sl) => sl != value);
};

// only for the multi select options
const multiSelectOptions = computed(() => {
  return props.selectMultiple
    ? props.options.filter((opt) => !selected.value.includes(opt.value))
    : props.options;
});

watch(
  () => selected.value,
  (val) => {
    if (val == "add-new") {
      emit("addNew");
      selected.value = "";
      select.value.selectedIndex = 0;
    }
  }
);
</script>

<style scoped>
.dropdown {
  @apply hidden shadow rounded group-focus:block w-full absolute z-50 bg-white text-sm;
}

.dropdown-item {
  @apply px-3 py-1 cursor-pointer rounded-sm hover:bg-blue-100;
}
</style>
