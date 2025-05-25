<template>
  <div class="cont flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Demo Page</h1>

    <div class="flex flex-col gap-3">
      <p class="text-sm font-medium"># Input Demos</p>
      <CustomInput
        name="test"
        :has-label="true"
        type="multi-string"
        label="Multi string demo"
        v-model="multiStringDemoModal"
        placeholder="Multi string demo"
      />

      <CustomInput
        step="0.01"
        name="test"
        type="number"
        :has-label="true"
        v-model="demoStepNumber"
        placeholder="Enter a number"
        label="Number step attribute demo"
      />
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { ref, watch } from 'vue'

const demoStepNumber = ref(0)
const multiStringDemoModal = ref([])

watch(
  () => multiStringDemoModal.value,
  (val) => {
    console.log(val)
  },
  { deep: true }
)
</script>
