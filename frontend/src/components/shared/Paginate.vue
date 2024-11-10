<template>
  <div class="pg-btn-wrapper">
    <button class="pg-btn" @click="navigatePagination('prev')">&Lt;</button>
    <button
      v-for="n in btnNums"
      :key="n"
      @click="currentActivePage = n"
      :class="n == currentActivePage ? 'pg-btn-active' : 'pg-btn'"
    >
      {{ n }}
    </button>
    <button class="pg-btn" @click="navigatePagination('next')">&Gt;</button>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  itemSelected: {
    type: Number,
    required: 0,
  },
});

const currentActivePage = ref(1);

const btnNums = computed(() => {
  return Math.ceil(props.data.length / props.itemSelected);
});

const paginatedData = computed(() => {
  const pgData = {};
  for (let ndx in Array.from(Array(btnNums.value).keys())) {
    ndx = Number.parseInt(ndx, 10);
    pgData[ndx + 1] = props.data.slice(
      ndx * props.itemSelected,
      (ndx + 1) * props.itemSelected,
    );
  }

  return pgData;
});

const currentItems = defineModel('currentItems');
currentItems.value = paginatedData.value[currentActivePage.value];

const navigatePagination = (direction) => {
  let tempRes = 0;
  switch (direction) {
    case 'prev':
      tempRes = currentActivePage.value - 1;
      if (tempRes > 0) currentActivePage.value--;
      break;
    case 'next':
      tempRes = currentActivePage.value + 1;
      if (tempRes <= btnNums.value)
        currentActivePage.value = currentActivePage.value + 1;
      break;
  }
};

watch(
  () => [currentActivePage.value, props.itemSelected],
  () => (currentItems.value = paginatedData.value[currentActivePage.value]),
);

watch(
  () => props.itemSelected,
  () => (currentActivePage.value = 1),
);
</script>
<style scoped>
.pg-btn {
  @apply border-primary
    border text-primary
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
