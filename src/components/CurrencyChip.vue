<template>
  <q-chip dense class="currency-chip" @click.stop="$emit('click')">
    <q-icon name="paid" size="13px" class="q-mr-xs" />
    {{ code }}
  </q-chip>
</template>

<script setup>
defineProps({
  code: { type: String, required: true },
})
defineEmits(['click'])
</script>
