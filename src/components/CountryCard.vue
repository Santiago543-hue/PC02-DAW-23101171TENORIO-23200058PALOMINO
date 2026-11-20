<template>
  <q-card class="country-card" flat bordered clickable @click="$emit('select', country)">
    <div class="country-card-head">
      <div class="flag-thumb">
        <img :src="country.flagUrl" :alt="`Bandera de ${country.name}`" loading="lazy" />
      </div>
      <div class="country-card-name" :title="country.name">{{ country.name }}</div>
    </div>
    <div class="country-card-meta">
      <span class="country-capital">Capital: {{ country.capital || '—' }}</span>
      <span class="country-population">{{ formatPopulation(country.population) }}</span>
    </div>
    <div class="country-card-chips">
      <q-chip dense class="continent-chip">{{ country.continent || '—' }}</q-chip>
      <CurrencyChip
        v-for="currency in country.currencies"
        :key="currency.code"
        :code="currency.code"
        @click="$emit('currency', currency, country)"
      />
      <q-chip v-if="country.currencies.length === 0" dense class="currency-chip">—</q-chip>
    </div>
  </q-card>
</template>

<script setup>
import CurrencyChip from './CurrencyChip.vue'
import { formatPopulation } from '../utils/format'

defineProps({
  country: { type: Object, required: true },
})
defineEmits(['select', 'currency'])
</script>
