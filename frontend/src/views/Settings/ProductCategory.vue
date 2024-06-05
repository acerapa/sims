<template>
  <div>Hello World</div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

console.log(router, route);
</script>
