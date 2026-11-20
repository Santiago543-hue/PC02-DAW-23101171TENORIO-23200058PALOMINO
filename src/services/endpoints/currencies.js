import { currenciesApi } from '../api'

export async function fetchCurrencyRates(code) {
  const { data } = await currenciesApi.get(`/rates/${encodeURIComponent(code)}`)
  return data
}

export async function convertCurrency(from, to, amount) {
  const { data } = await currenciesApi.get('/convert', {
    params: { from, to, amount },
  })
  return data
}
