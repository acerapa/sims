<template>
  <div class="cont">
    <p class="font-semibold">Employee Details</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  console.log(route.params.id)
})
</script>
