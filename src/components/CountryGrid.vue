<template>
  <div class="country-grid">
    <template v-if="loading">
      <q-card v-for="number in 8" :key="number" flat bordered class="country-card skeleton-card">
        <div class="country-card-head">
          <q-skeleton width="36px" height="26px" />
          <q-skeleton width="65%" height="20px" />
        </div>
        <div class="country-card-meta">
          <q-skeleton width="55%" height="14px" />
          <q-skeleton width="20%" height="14px" />
        </div>
        <div class="country-card-chips">
          <q-skeleton type="QChip" width="82px" height="20px" />
          <q-skeleton type="QChip" width="56px" height="20px" />
        </div>
      </q-card>
    </template>
    <CountryCard
      v-for="country in countries"
      v-else
      :key="country.alpha2 || country.name"
      :country="country"
      @select="$emit('select', $event)"
      @currency="(currency, selectedCountry) => $emit('currency', currency, selectedCountry)"
    />
  </div>
</template>

<script setup>
import CountryCard from './CountryCard.vue'

defineProps({
  countries: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['select', 'currency'])
</script>
