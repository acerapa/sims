<template>
  <div
    class="flex flex-col relative"
    :class="props.disabled ? 'pointer-events-none' : ''"
  >
    <select
      class="input flex-1"
      v-model="selected"
      ref="select"
      v-if="!props.selectMultiple && !props.canSearch"
      :disabled="props.disabled"
      @change="emit('change')"
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

    <div
      class="relative flex flex-col group"
      v-if="!props.selectMultiple && props.canSearch"
      tabindex="0"
      ref="singleDropdownGroup"
    >
      <input
        type="search"
        class="input w-full disabled:bg-white"
        :placeholder="props.placeholder"
        tabindex="0"
        ref="singleDropdown"
        v-model="search"
        :disabled="props.disabled"
        @blur="onBlurSelect"
      />
      <div
        class="hidden bg-white group-focus-within:block rounded shadow w-full max-h-40 overflow-y-auto"
      >
        <p
          v-if="props.hasAddNew"
          class="dropdown-item"
          @click="
            () => {
              emit('addNew')
              singleDropdown.blur()
              singleDropdownGroup.blur()
            }
          "
        >
          &lt;&lt;Add New&gt;&gt;
        </p>
        <p
          class="dropdown-item"
          v-for="(option, ndx) in filteredOptions"
          :key="ndx"
          @click="
            () => {
              selectOption(option.value)
              singleDropdown.blur()
              singleDropdownGroup.blur()
            }
          "
        >
          {{ option.text }}
        </p>
      </div>
    </div>

    <div class="relative group z-10" tabindex="0">
      <div
        class="min-h-[38px] relative z-10"
        :class="[
          props.canSearch ? 'border px-3 py-2 rounded' : 'input',
          props.disabled ? 'border-none pointer-events-none' : ''
        ]"
        v-if="props.selectMultiple"
      >
        <p
          v-if="props.placeholder && !selected.length"
          class="text-sm text-gray-400 group-focus-within:hidden"
        >
          {{ props.placeholder }}
        </p>
        <input
          type="search"
          class="input !border-none !p-0 mb-2 hidden group-focus:block group-focus-within:block w-full"
          v-model="search"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
        />
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
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['addNew', 'change'])

const props = defineProps({
  placeholder: {
    type: String,
    required: false
  },
  hasAddNew: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    required: true
  },
  selectMultiple: {
    type: Boolean,
    default: false
  },
  canSearch: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const search = ref('')

const singleDropdown = ref()
const singleDropdownGroup = ref()

const selected = defineModel()
const select = ref()

onMounted(() => {
  if (props.canSearch && selected.value && !props.selectMultiple) {
    search.value = getName(selected.value)
  }
})

const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    option.text.toLowerCase().includes(search.value.toLowerCase())
  )
})

const getName = (value) => {
  return props.options.find((opt) => opt.value == value).text
}

const selectOption = (value) => {
  selected.value = value
  search.value = getName(value)
  emit('change')
}

const onSelectOpt = (value) => {
  selected.value.push(value)
}

const removeSelectedValue = (value) => {
  selected.value = selected.value.filter((sl) => sl != value)
}

// only for the multi select options
const multiSelectOptions = computed(() => {
  const opts = props.canSearch ? filteredOptions.value : props.options
  return props.selectMultiple
    ? opts.filter((opt) => !selected.value.includes(opt.value))
    : opts
})

const onBlurSelect = () => {
  setTimeout(() => {
    if (props.canSearch && !props.selectMultiple && !search.value) {
      // selectOption(selected.value);
      selected.value = ''
      emit('change')
    }
  }, 500)
}

watch(
  () => selected.value,
  (val) => {
    if (val == 'add-new') {
      emit('addNew')
      selected.value = ''
      select.value.selectedIndex = 0
    }
  }
)
</script>

<style scoped>
.dropdown {
  @apply hidden shadow rounded group-focus-within:block w-full absolute z-50 bg-white text-sm;
}

.dropdown-item {
  @apply px-3 py-1 cursor-pointer text-sm rounded-sm hover:bg-blue-100;
}
</style>
