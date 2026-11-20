import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY

function createApi(baseURL) {
  return axios.create({
    baseURL,
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    timeout: 15000,
  })
}

export const countriesApi = createApi('https://api.restcountries.com/countries/v5')
export const currenciesApi = createApi('https://api.restcountries.com/currencies/v1')
