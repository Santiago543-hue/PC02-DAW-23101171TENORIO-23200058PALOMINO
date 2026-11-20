<template>
  <div class="field-control continent-field">
    <div class="field-label">Continente</div>
    <q-select
      :model-value="modelValue"
      :options="options"
      outlined
      dense
      emit-value
      map-options
      options-dense
      aria-label="Filtrar por continente"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const options = [
  { label: 'Todos los continentes', value: '' },
  { label: 'Sudamérica', value: 'Sudamérica' },
  { label: 'Norteamérica', value: 'Norteamérica' },
  { label: 'Europa', value: 'Europa' },
  { label: 'Asia', value: 'Asia' },
  { label: 'África', value: 'África' },
  { label: 'Oceanía', value: 'Oceanía' },
]
</script>
