<template>
  <div class="field-control search-field">
    <div class="field-label">Buscar</div>
    <q-input
      v-model="searchText"
      outlined
      dense
      clearable
      placeholder="Buscar por capital..."
      aria-label="Buscar por capital"
    >
      <template #prepend>
        <q-icon name="search" color="grey-6" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  delay: { type: Number, default: 400 },
})
const emit = defineEmits(['update:modelValue'])
const searchText = ref(props.modelValue)
let debounceTimer

watch(() => props.modelValue, (value) => {
  if (value !== searchText.value) searchText.value = value
})

watch(searchText, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => emit('update:modelValue', value ?? ''), props.delay)
})

onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>
