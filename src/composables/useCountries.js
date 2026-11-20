import { ref } from 'vue'
import {
  fetchCountries as requestCountries,
  fetchCountriesByRegion,
  fetchCountryByAlpha2,
  searchCountries,
} from '../services/endpoints/countries'
import { mapCountries } from '../utils/mapCountry'

const listCache = new Map()
const detailCache = new Map()
const countriesByAlpha3 = new Map()

function rememberCountries(countries) {
  countries.forEach((country) => {
    if (country.alpha3) countriesByAlpha3.set(country.alpha3.toUpperCase(), country.name)
  })
}

export function getCountryNameByCode(alpha3) {
  return countriesByAlpha3.get(String(alpha3 ?? '').toUpperCase()) ?? ''
}

function getRecords(payload) {
  return mapCountries(payload)
}

export function useCountries() {
  const data = ref([])
  const loading = ref(false)
  const error = ref('')
  let latestListRequest = 0
  let latestDetailRequest = 0

  async function loadCountries({ capital = '', continent = '' } = {}, { force = false } = {}) {
    const query = capital.trim()
    const cacheKey = `${query.toLocaleLowerCase()}|${continent}`
    const requestId = ++latestListRequest
    loading.value = true
    error.value = ''

    try {
      if (!force && listCache.has(cacheKey)) {
        const cachedCountries = listCache.get(cacheKey)
        if (requestId === latestListRequest) {
          data.value = cachedCountries
          rememberCountries(cachedCountries)
        }
        return cachedCountries
      }

      let payload
      if (query) {
        payload = await searchCountries(query)
      } else if (continent) {
        const apiRegion = continent === 'Europa' ? 'Europe'
          : continent === 'Asia' ? 'Asia'
            : continent === 'África' ? 'Africa'
              : continent === 'Oceanía' ? 'Oceania'
                : 'Americas'
        payload = await fetchCountriesByRegion(apiRegion)
      } else {
        payload = await requestCountries()
      }

      let countries = getRecords(payload)
      if (continent && query) {
        countries = countries.filter((country) => country.continent === continent)
      } else if (continent && ['Sudamérica', 'Norteamérica'].includes(continent)) {
        countries = countries.filter((country) => country.continent === continent)
      }

      listCache.set(cacheKey, countries)
      if (requestId === latestListRequest) {
        data.value = countries
        rememberCountries(countries)
      }
      return countries
    } catch (requestError) {
      if (requestId === latestListRequest) {
        error.value = requestError.response?.data?.message
          ?? requestError.message
          ?? 'No se pudo cargar el listado de países.'
      }
      throw requestError
    } finally {
      if (requestId === latestListRequest) loading.value = false
    }
  }

  async function loadCountry(code, { force = false } = {}) {
    const normalizedCode = String(code ?? '').toUpperCase()
    const requestId = ++latestDetailRequest
    loading.value = true
    error.value = ''
    try {
      if (!force && detailCache.has(normalizedCode)) {
        return detailCache.get(normalizedCode)
      }
      const country = getRecords(await fetchCountryByAlpha2(normalizedCode))[0]
      if (!country) throw new Error('La API no devolvió información para este país.')
      detailCache.set(normalizedCode, country)
      rememberCountries([country])
      return country
    } catch (requestError) {
      if (requestId === latestDetailRequest) {
        error.value = requestError.response?.data?.message
          ?? requestError.message
          ?? 'No se pudo cargar el detalle del país.'
      }
      throw requestError
    } finally {
      if (requestId === latestDetailRequest) loading.value = false
    }
  }

  return { data, loading, error, loadCountries, loadCountry }
}
