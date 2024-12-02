<template>
  <div class="cont">
    <canvas ref="context"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'

const context = ref(null)
const chart = ref(null)

const props = defineProps({
  type: {
    type: String,
    default: 'bar'
  },
  data: {
    type: Object,
    default: () => {}
  },
  plugins: {
    type: Object,
    required: false
  }
})

onMounted(() => {
  if (context.value) {
    chart.value = new Chart(context.value, {
      type: props.type,
      data: props.data,
      options: {
        resizeDelay: 0,
        responsive: true,
        plugins: props.plugins
      }
    })
  }
})
</script>
