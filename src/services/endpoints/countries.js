import { countriesApi } from '../api'

export async function fetchCountries() {
  const { data } = await countriesApi.get('/')
  return data
}

export async function searchCountries(query) {
  const { data } = await countriesApi.get('/', { params: { q: query } })
  return data
}

export async function fetchCountriesByRegion(region) {
  const { data } = await countriesApi.get(`/region/${encodeURIComponent(region)}`)
  return data
}

export async function fetchCountryByAlpha2(code) {
  const { data } = await countriesApi.get(`/codes.alpha_2/${encodeURIComponent(code)}`)
  return data
}
