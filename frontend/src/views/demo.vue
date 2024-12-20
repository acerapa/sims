<template>
  <div class="cont">
    <h1 class="text-2xl font-bold">Demo Page</h1>

    <p>Multi string input demo</p>
    <CustomInput
      name="test"
      type="multi-string"
      v-model="multiStringDemoModal"
      placeholder="Multi string demo"
    />
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { ref, watch } from 'vue'

const multiStringDemoModal = ref([])

watch(
  () => multiStringDemoModal.value,
  (val) => {
    console.log(val)
  },
  { deep: true }
)
</script>
