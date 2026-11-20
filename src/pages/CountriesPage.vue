<template>
  <main class="page-shell">
    <div class="page-container">
      <header class="page-header">
        <div>
          <h1>Explorador de países</h1>
          <p>Busca por capital, filtra por continente, toca una tarjeta para ver el detalle o toca la moneda para ver su tasa</p>
        </div>
      </header>

      <section class="filter-row" aria-label="Filtros de países">
        <SearchBar v-model="capitalQuery" />
        <ContinentSelect v-model="continent" />
      </section>

      <StateMessage
        v-if="error"
        type="error"
        :message="error"
        @retry="retryCountries"
      />
      <StateMessage v-else-if="!loading && countries.length === 0" type="empty" />
      <CountryGrid
        v-else
        :countries="countries"
        :loading="loading"
        @select="openCountry"
        @currency="openCurrency"
      />
    </div>

    <CurrencyModal v-model="currencyDialog" :currency="selectedCurrency" />
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ContinentSelect from '../components/ContinentSelect.vue'
import CountryGrid from '../components/CountryGrid.vue'
import CurrencyModal from '../components/CurrencyModal.vue'
import SearchBar from '../components/SearchBar.vue'
import StateMessage from '../components/StateMessage.vue'
import { useCountries } from '../composables/useCountries'

const router = useRouter()
const { data: countries, loading, error, loadCountries } = useCountries()
const capitalQuery = ref('')
const continent = ref('')
const currencyDialog = ref(false)
const selectedCurrency = ref(null)

onMounted(() => loadCountries().catch(() => {}))
watch([capitalQuery, continent], ([capital, selectedContinent]) => {
  loadCountries({ capital, continent: selectedContinent }).catch(() => {})
})

function openCountry(country) {
  router.push({ name: 'country-detail', params: { code: country.alpha2.toUpperCase() } })
}

function openCurrency(currency) {
  selectedCurrency.value = currency
  currencyDialog.value = true
}

function retryCountries() {
  loadCountries({ capital: capitalQuery.value, continent: continent.value }, { force: true }).catch(() => {})
}
</script>
