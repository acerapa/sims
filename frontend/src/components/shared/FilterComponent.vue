<template>
  <div class="filter">
    <div class="flex justify-between items-center">
      <p>Filters</p>
      <img
        src="@/assets/icons/close.svg"
        alt="close"
        class="cursor-pointer"
        @click="showFilter = false"
      />
    </div>
    <form ref="filter_form">
      <slot name="filters"></slot>
    </form>
    <div class="flex gap-3 items-center justify-end">
      <button
        type="button"
        class="btn-outline !text-xs !py-1 !px-2"
        @click="onClear"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const showFilter = defineModel(false);
const isFilterUsed = defineModel("isFilterUsed");

const filter_form = ref();

onMounted(() => {
  if (filter_form.value.elements.length) {
    for (let el of Array.from(filter_form.value)) {
      el.addEventListener("change", function () {
        isFilterUsed.value = true;
      });
    }
  }
});

const onClear = () => {
  filter_form.value.reset();
  const change = new Event("change");
  for (let el of filter_form.value.elements) {
    el.dispatchEvent(change);
  }
  isFilterUsed.value = false;
};
</script>

<style scoped>
.filter {
  position: absolute;
  top: 60px;
  left: 12px;
  @apply p-4 shadow bg-white rounded-xl border-2 flex flex-col gap-4;
}
</style>
