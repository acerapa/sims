<template>
  <div>
    <div class="cont">
      <h1 class="text-lg">Your all set 🎉!</h1>
    </div>

    <!-- TODO: Implement charts fo visualization. For charts can refer to this link: https://vue-chartjs.org/guide/ -->

    <div class="flex flex-col gap-3">
      <p class="mt-5">Sales Visual Reports</p>
      <div class="flex gap-3 items-start">
        <ChartWrapper
          class="flex-1"
          type="bar"
          :data="barChartConfig"
          :plugins="{ title: { text: 'Sales by month', display: true } }"
        />
        <ChartWrapper
          class="flex-1"
          type="doughnut"
          :plugins="{
            legend: { display: true, position: 'bottom', align: 'start' },
            title: { text: 'Summary of items sold', display: true }
          }"
          :data="pieChartConfig"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <p class="mt-5">Inventories Visual Reports</p>
    </div>
  </div>
</template>

<script setup>
import Event from '@/event'
import { EventEnum } from '@/data/event'

import ChartWrapper from '@/components/shared/ChartWrapper.vue'
import { onMounted } from 'vue'

// sample implemetation
Event.emit(EventEnum.IS_PAGE_LOADING, true)

// sample chart configurations
const sampleData = [
  { month: 'January', sales: 200, purchases: 180 },
  { month: 'Febuary', sales: 2000, purchases: 1500 },
  { month: 'March', sales: 150, purchases: 80 },
  { month: 'April', sales: 25000, purchases: 20000 },
  { month: 'May', sales: 2200, purchases: 3000 },
  { month: 'June', sales: 30000, purchases: 10000 },
  { month: 'July', sales: 28000, purchases: 10000 }
]

const barChartConfig = {
  labels: sampleData.map((row) => row.month),
  datasets: [
    {
      label: 'Sales',
      data: sampleData.map((r) => r.sales)
    },
    {
      label: 'Purchases',
      data: sampleData.map((r) => r.purchases)
    }
  ]
}

const pieChartConfig = {
  labels: [
    'battery',
    'smart phone',
    'laptops',
    'repairs',
    'Cables',
    'CCTV',
    'CPU',
    'Processors'
  ],
  datasets: [
    {
      data: [30, 23, 45, 657, 78, 89, 10, 68]
    }
  ]
}

onMounted(() => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
