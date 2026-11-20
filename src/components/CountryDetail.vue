<template>
  <main class="page-shell">
    <div class="page-container">
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        icon="chevron_left"
        label="Volver al listado"
        class="back-button"
        @click="router.push('/')"
      />

      <StateMessage
        v-if="error"
        type="error"
        :message="error"
        @retry="loadDetail(true)"
      />
      <div v-else-if="loading" class="detail-loading">
        <q-card flat bordered class="detail-card">
          <q-skeleton width="96px" height="64px" />
          <q-skeleton width="55%" height="32px" />
          <q-skeleton height="92px" />
          <q-skeleton height="250px" />
        </q-card>
      </div>
      <div v-else-if="country" class="detail-layout">
        <q-card flat bordered class="detail-card">
          <div class="detail-heading">
            <img class="detail-flag" :src="country.flagUrl" :alt="`Bandera de ${country.name}`" />
            <div>
              <h1>{{ country.name }}</h1>
              <q-chip dense class="continent-chip">{{ country.continent || '—' }}</q-chip>
            </div>
          </div>

          <div class="capital-banner">
            <q-icon name="location_on" size="28px" />
            <div>
              <div class="capital-label">CAPITAL</div>
              <div class="capital-name">{{ country.capital || 'Sin capital registrada' }}</div>
            </div>
          </div>

          <div class="info-grid">
            <InfoTile label="Población" :value="formatPopulation(country.population)" />
            <InfoTile label="Área" :value="formatArea(country.area)" />
            <InfoTile
              label="Moneda"
              :value="currencyLabel"
              clickable
              icon="info_outline"
              @click="openCurrency"
            />
            <InfoTile label="Idiomas" :value="formatList(country.languages)" />
            <InfoTile label="Zona horaria" :value="formatList(country.timezones)" />
            <InfoTile label="Código telefónico" :value="country.callingCode" />
            <InfoTile label="Dominio" :value="country.domain" />
            <InfoTile label="Conducción" :value="country.drivingSide" />
            <div aria-hidden="true" />
          </div>

          <section class="borders-section">
            <div class="section-label">Países fronterizos</div>
            <div v-if="borderCountries.length" class="border-chips">
              <q-chip v-for="border in borderCountries" :key="border.code" dense class="border-chip">
                {{ border.name }}
              </q-chip>
            </div>
            <div v-else class="no-borders">Sin fronteras terrestres</div>
          </section>
        </q-card>
      </div>
    </div>
    <CurrencyModal v-model="currencyDialog" :currency="selectedCurrency" />
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CurrencyModal from './CurrencyModal.vue'
import InfoTile from './InfoTile.vue'
import StateMessage from './StateMessage.vue'
import { getCountryNameByCode, useCountries } from '../composables/useCountries'
import { formatArea, formatList, formatPopulation } from '../utils/format'

const props = defineProps({
  code: { type: String, default: '' },
})
const route = useRoute()
const router = useRouter()
const { loading, error, loadCountry } = useCountries()
const country = ref(null)
const currencyDialog = ref(false)
const selectedCurrency = ref(null)
const currencyLabel = computed(() => {
  const currency = country.value?.currencies?.[0]
  return currency ? `${currency.name} (${currency.code})` : '—'
})
const borderCountries = computed(() => (country.value?.borders ?? []).map((border) => {
  const code = typeof border === 'string' ? border : border?.alpha_3 ?? border?.code ?? ''
  return { code, name: getCountryNameByCode(code) || code }
}).filter((border) => border.code))

async function loadDetail(force = false) {
  const requestedCode = String(props.code || route.params.code).toUpperCase()
  try {
    const loadedCountry = await loadCountry(requestedCode, { force })
    const activeCode = String(props.code || route.params.code).toUpperCase()
    if (requestedCode === activeCode) country.value = loadedCountry
  } catch {
    const activeCode = String(props.code || route.params.code).toUpperCase()
    if (requestedCode === activeCode) country.value = null
  }
}

function openCurrency() {
  const currency = country.value?.currencies?.[0]
  if (!currency) return
  selectedCurrency.value = currency
  currencyDialog.value = true
}

onMounted(() => loadDetail())
watch(() => props.code || route.params.code, () => loadDetail())
</script>
