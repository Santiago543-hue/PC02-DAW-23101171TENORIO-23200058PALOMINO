import { ref } from 'vue'
import { convertCurrency, fetchCurrencyRates } from '../services/endpoints/currencies'

const ratesCache = new Map()

function recordsFrom(payload) {
  if (Array.isArray(payload?.data?.objects)) return payload.data.objects
  if (Array.isArray(payload?.objects)) return payload.objects
  return []
}

function rateToUsd(payload) {
  const direct = payload?.rates?.USD ?? payload?.data?.rates?.USD
  if (Number.isFinite(Number(direct))) return Number(direct)

  const record = recordsFrom(payload).find((item) => {
    const code = item?.to?.code ?? item?.code ?? item?.currency
    return String(code ?? '').toUpperCase() === 'USD'
  })
  const rate = record?.rate ?? record?.value ?? record?.to?.rate
  return Number.isFinite(Number(rate)) ? Number(rate) : null
}

function convertedAmount(payload) {
  const record = recordsFrom(payload)[0] ?? payload?.data ?? payload
  const result = record?.result ?? record?.converted_amount ?? record?.amount
  return Number.isFinite(Number(result)) ? Number(result) : null
}

export function useCurrency() {
  const data = ref(null)
  const loading = ref(false)
  const converting = ref(false)
  const error = ref('')
  const conversionError = ref('')
  const conversionResult = ref(null)

  async function loadRates(code, { force = false } = {}) {
    const currencyCode = String(code ?? '').toUpperCase()
    loading.value = true
    error.value = ''
    conversionResult.value = null
    try {
      if (!force && ratesCache.has(currencyCode)) {
        data.value = ratesCache.get(currencyCode)
        return data.value
      }
      const response = await fetchCurrencyRates(currencyCode)
      const rate = rateToUsd(response)
      if (rate === null) throw new Error('La API no devolvió una tasa para USD.')
      data.value = { code: currencyCode, rate, raw: response }
      ratesCache.set(currencyCode, data.value)
      return data.value
    } catch (requestError) {
      error.value = requestError.response?.data?.message
        ?? requestError.message
        ?? 'No se pudo cargar la tasa de cambio.'
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function convert(code, amount) {
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      conversionError.value = 'Ingresa un monto mayor que cero.'
      conversionResult.value = null
      return null
    }

    converting.value = true
    conversionError.value = ''
    conversionResult.value = null
    try {
      const response = await convertCurrency(String(code).toUpperCase(), 'USD', numericAmount)
      const result = convertedAmount(response)
      if (result === null) throw new Error('La API no devolvió el resultado de la conversión.')
      conversionResult.value = { amount: numericAmount, result }
      return conversionResult.value
    } catch (requestError) {
      conversionError.value = requestError.response?.data?.message
        ?? requestError.message
        ?? 'No se pudo convertir el monto.'
      throw requestError
    } finally {
      converting.value = false
    }
  }

  return { data, loading, converting, error, conversionError, conversionResult, loadRates, convert }
}
