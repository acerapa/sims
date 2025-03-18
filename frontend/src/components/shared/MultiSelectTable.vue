<template>
  <div class="main-table">
    <component
      :is="props.headerComponent"
      v-bind="{ isDisabled: props.isDisabled }"
      class="mb-4"
    />
    <div class="flex flex-col gap-4">
      <component
        :is="props.rowComponent"
        v-if="dataInputs.length"
        v-for="ndx in GeneralHelpers.getRange(dataInputs.length)"
        :key="
          dataInputs[ndx].hasOwnProperty('id')
            ? dataInputs[ndx].id
            : dataInputs[ndx]
        "
        v-model="dataInputs[ndx]"
        v-bind="propsBinder(ndx)"
        @remove="onRemove(ndx)"
      ></component>
      <div class="flex flex-col gap-4" v-if="!dataInputs.length">
        <p class="text-center text-sm">Table has no data!</p>
      </div>
    </div>
  </div>
  <div class="flex justify-between mt-4 items-center">
    <button
      type="button"
      v-if="props.hasAddNewItem && !props.isDisabled"
      @click="onNewItem"
      class="btn text-nowrap"
    >
      Add new item
    </button>
    <slot name="aggregate"></slot>
  </div>
</template>

<script setup>
import { GeneralHelpers } from 'shared/helpers'

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  },
  headerComponent: {
    type: Object,
    required: true
  },
  rowComponent: {
    type: Object,
    required: true
  },
  rowPropInit: {
    type: String,
    required: false
  },
  headerPropInit: {
    type: String,
    required: false
  },
  hasAddNewItem: {
    type: Boolean,
    default: true
  },
  format: {
    type: Object,
    required: true
  },
  rowEventName: {
    type: String,
    required: false
  },
  rowProps: {
    type: Object,
    required: false
  }
})

const dataInputs = defineModel()
const onNewItem = () => {
  dataInputs.value.push({ ...props.format })
}

const propsBinder = (ndx) => {
  let bind = {
    ndx: ndx
  }

  if (props.rowEventName) {
    bind.eventName = props.rowEventName
  }

  if (props.isDisabled) {
    bind.isDisabled = props.isDisabled
  }

  if (props.rowProps) {
    bind = { ...bind, ...props.rowProps }
  }

  return bind
}

const onRemove = (ndx) => {
  dataInputs.value = dataInputs.value.filter((item, index) => index != ndx)
}
</script>
