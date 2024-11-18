<template>
  <ModalWrapper title="Receive Order" v-model="showModal"> </ModalWrapper>
</template>

<script setup>
import ModalWrapper from '@/components/shared/ModalWrapper.vue'

const showModal = defineModel()
</script>
