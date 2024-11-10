<template>
  <div
    class="cont alert-danger flex justify-between items-center"
    :class="alertTypes[type].class"
  >
    <div class="alert-content">
      {{ props.text }}
      <slot></slot>
    </div>
    <button v-if="props.hasClose">
      <svg
        class="w-5 h-5 alert-danger !border-none"
        :class="alertTypes[type].class"
        id="efCSyDKnUAe1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 200 200"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
        project-id="dbf7cd378ffe48849fc613fa85281bb9"
        export-id="6d73aef63c024cb0afe3bf0b9df2e723"
        cached="false"
        width="200"
        height="200"
      >
        <ellipse
          rx="90"
          ry="90"
          transform="translate(100 100)"
          fill=""
          stroke-width="0"
        />
        <g transform="translate(.000001 0)">
          <g transform="matrix(.79637 0 0 0.795688 20.370236 20.438461)">
            <rect
              width="20"
              height="20"
              rx="0"
              ry="0"
              transform="matrix(4.2501 4.2501-.707107 0.707107 64.570068 50.427933)"
              fill="#fff"
              stroke-width="0"
            />
            <ellipse
              rx="10"
              ry="10"
              transform="translate(57.570068 57.570068)"
              fill="#fff"
              stroke-width="0"
            />
            <ellipse
              rx="10"
              ry="10"
              transform="translate(142.501 142.501)"
              fill="#fff"
              stroke-width="0"
            />
          </g>
          <g transform="matrix(.79637 0 0 0.795688 20.370236 20.431201)">
            <rect
              width="20"
              height="20"
              rx="0"
              ry="0"
              transform="matrix(4.2501-4.2501 0.707107 0.707107 50.427933 135.429932)"
              fill="#fff"
              stroke-width="0"
            />
            <ellipse
              rx="10"
              ry="10"
              transform="translate(57.570068 142.501)"
              fill="#fff"
              stroke-width="0"
            />
            <ellipse
              rx="10"
              ry="10"
              transform="translate(142.501 57.499001)"
              fill="#fff"
              stroke-width="0"
            />
          </g>
        </g>
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    validator: (value) => {
      return ['danger', 'info', 'warning', 'success'].includes(value);
    },
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  hasClose: {
    type: Boolean,
    default: false,
  },
});

const alertTypes = Object.freeze({
  danger: {
    text: 'Danger',
    class: 'alert-danger',
  },
  info: {
    text: 'Information',
    class: 'alert-info',
  },
  warning: {
    text: 'Warning',
    class: 'alert-warning',
  },
  success: {
    text: 'success',
    class: 'alert-success',
  },
});
</script>

<style scoped>
.alert-danger {
  color: var(--danger);
  border: var(--danger) solid 1px;
  fill: var(--danger);
}

.alert-info {
  color: var(--open);
  border: var(--open) solid 1px;
  fill: var(--open);
}

.alert-warning {
  color: var(--warning);
  border: var(--warning) solid 1px;
  fill: var(--warning);
}

.alert-success {
  color: var(--success);
  border: var(--success) solid 1px;
  fill: var(--success);
}
</style>
