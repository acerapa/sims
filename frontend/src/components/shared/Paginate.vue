<template>
  <div class="pg-btn-wrapper">
    <button
      class="pg-btn border border-primary"
      @click="navigatePagination('prev')"
    >
      &Lt;
    </button>
    <button
      v-for="n in generatedPageBtn"
      :key="n"
      @click="currentActivePage = n != '...' ? n : currentActivePage"
      :class="n == currentActivePage ? 'pg-btn-active' : 'pg-btn'"
    >
      {{ n }}
    </button>
    <button
      class="pg-btn border border-primary"
      @click="navigatePagination('next')"
    >
      &Gt;
    </button>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { GeneralHelpers } from 'shared'

const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  itemSelected: {
    type: Number,
    required: 0
  }
})

const maxBtnNum = 7

const currentActivePage = ref(1)

const btnNums = computed(() => {
  return Math.ceil(props.data.length / props.itemSelected)
})

const paginatedData = computed(() => {
  const pgData = {}
  for (let ndx in Array.from(Array(btnNums.value).keys())) {
    ndx = Number.parseInt(ndx, 10)
    pgData[ndx + 1] = props.data.slice(
      ndx * props.itemSelected,
      (ndx + 1) * props.itemSelected
    )
  }

  return pgData
})

const generatedPageBtn = computed(() => {
  let items = []
  if (btnNums.value <= maxBtnNum) {
    items = GeneralHelpers.getRange(1, btnNums.value + 1)
  } else {
    let pagiPadding = Math.ceil(maxBtnNum / 2)

    // get left
    if (currentActivePage.value <= pagiPadding) {
      items.push(1, 2)
    } else {
      items.push(1, '...')
    }

    // get middle
    let midItemNum = maxBtnNum - pagiPadding
    if (currentActivePage.value <= midItemNum) {
      items.push(...GeneralHelpers.getRange(3, 3 + midItemNum))
    } else {
      let base = currentActivePage.value - 1
      let startPointStoper = btnNums.value - (1 + midItemNum)
      let endPointStoper = btnNums.value - 1

      let startPoint = base < startPointStoper ? base : startPointStoper
      let endPoint =
        base + midItemNum >= endPointStoper ? endPointStoper : base + midItemNum

      items.push(...GeneralHelpers.getRange(startPoint, endPoint))
    }

    // get right
    if (btnNums.value - currentActivePage.value >= pagiPadding) {
      items.push('...', btnNums.value)
    } else {
      items.push(btnNums.value - 1, btnNums.value)
    }
  }

  return items
})

const currentItems = defineModel('currentItems')
currentItems.value = paginatedData.value[currentActivePage.value]

const navigatePagination = (direction) => {
  let tempRes = 0
  switch (direction) {
    case 'prev':
      tempRes = currentActivePage.value - 1
      if (tempRes > 0) currentActivePage.value--
      break
    case 'next':
      tempRes = currentActivePage.value + 1
      if (tempRes <= btnNums.value)
        currentActivePage.value = currentActivePage.value + 1
      break
  }
}

watch(
  () => [currentActivePage.value, props.itemSelected],
  () => (currentItems.value = paginatedData.value[currentActivePage.value])
)

watch(
  () => props.itemSelected,
  () => (currentActivePage.value = 1)
)
</script>
<style scoped>
.pg-btn {
  @apply text-primary
    rounded text-xs
    font-bold px-1
    hover:bg-primary
    hover:text-white
    min-w-[34px]
    min-h-[34px];
}

.pg-btn-active {
  @apply rounded text-xs font-bold px-1 bg-primary text-white min-w-[34px] min-h-[34px];
}

.pg-btn-wrapper {
  @apply flex gap-1;
}
</style>
