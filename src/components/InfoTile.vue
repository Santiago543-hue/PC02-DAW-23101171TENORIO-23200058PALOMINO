<template>
  <button
    v-if="clickable"
    type="button"
    class="info-tile info-tile-button"
    @click="$emit('click')"
  >
    <span class="info-tile-label">{{ label }}</span>
    <span class="info-tile-value">
      {{ value }}
      <q-icon v-if="icon" :name="icon" size="14px" class="q-ml-xs" />
    </span>
  </button>
  <div v-else class="info-tile">
    <span class="info-tile-label">{{ label }}</span>
    <span class="info-tile-value">{{ value || '—' }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, default: '' },
  clickable: { type: Boolean, default: false },
  icon: { type: String, default: '' },
})
defineEmits(['click'])
</script>
