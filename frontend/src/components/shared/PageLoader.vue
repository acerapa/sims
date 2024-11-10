<template>
  <div
    class="backdrop-blur-sm fixed top-0 left-0 w-full h-full flex justify-center items-center z-[60]"
  >
    <div class="loader-image"></div>
  </div>
</template>

<script setup></script>

<style scoped>
.loader-image {
  z-index: 2;
  @apply w-16 h-16 rounded-full relative border;
}

.loader-image::after {
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 112%;
  content: '';
  height: 112%;
  position: absolute;
  @apply rounded-full;
  background-color: transparent;
  animation: rotate-loader 1s infinite linear reverse;
  background-image: conic-gradient(#424489, transparent);
}

.loader-image::before {
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  content: '';
  height: 100%;
  position: absolute;
  background-size: cover;
  background-position: center;
  background-image: url('@/assets/logo-icon.png');
}

@keyframes rotate-loader {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
