<template>
  <div v-if="type === 'error'" class="state-error">
    <q-banner rounded class="bg-red-1 text-negative">
      <template #avatar>
        <q-icon name="error_outline" />
      </template>
      <div class="text-weight-medium">{{ message }}</div>
      <template #action>
        <q-btn flat dense color="negative" label="Reintentar" @click="$emit('retry')" />
      </template>
    </q-banner>
  </div>
  <div v-else-if="type === 'empty'" class="empty-state">
    <q-icon name="travel_explore" size="42px" color="grey-5" />
    <div>No se encontraron países</div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: '' },
  message: { type: String, default: 'Ocurrió un error inesperado.' },
})
defineEmits(['retry'])
</script>
