<template>
  <q-dialog v-model="dialogVisible" @show="prepareCurrency">
    <q-card class="currency-dialog-card">
      <q-inner-loading :showing="loading">
        <q-spinner color="primary" size="34px" />
      </q-inner-loading>
      <div class="currency-dialog-close-row">
        <q-btn round flat dense icon="close" aria-label="Cerrar" @click="dialogVisible = false" />
      </div>

      <template v-if="currency">
        <div class="currency-dialog-heading">
          <div class="currency-symbol">{{ currency.symbol || currency.code }}</div>
          <div>
            <div class="currency-name">{{ currency.name || currency.code }}</div>
            <div class="currency-subtitle">{{ currency.code }} · API: Currencies (rates)</div>
          </div>
        </div>

        <StateMessage
          v-if="error"
          type="error"
          :message="error"
          @retry="prepareCurrency(true)"
        />
        <template v-else-if="rateData">
          <div class="rate-box">
            1 {{ currency.code }} = {{ formatNumber(rateData.rate, 4) }} USD
          </div>
          <div class="convert-label">
            Convertir <span>monto</span> en {{ currency.code }}
          </div>
          <q-input
            v-model.number="amount"
            type="number"
            min="0.01"
            step="any"
            outlined
            dense
            :error="Boolean(conversionError)"
            :error-message="conversionError"
            aria-label="Monto a convertir"
          />
          <q-btn
            class="full-width convert-button"
            color="primary"
            unelevated
            :loading="converting"
            :label="`Convertir a USD`"
            @click="handleConvert"
          />
          <div v-if="conversionResult" class="rate-box conversion-result">
            {{ formatNumber(conversionResult.amount) }} {{ currency.code }} =
            {{ formatNumber(conversionResult.result) }} USD
          </div>
        </template>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCurrency } from '../composables/useCurrency'
import { formatNumber } from '../utils/format'
import StateMessage from './StateMessage.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  currency: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
const amount = ref(100)
const {
  data: rateData,
  loading,
  converting,
  error,
  conversionError,
  conversionResult,
  loadRates,
  convert,
} = useCurrency()

watch(() => props.currency?.code, () => {
  amount.value = 100
})

async function prepareCurrency(force = false) {
  if (!props.currency?.code) return
  try {
    await loadRates(props.currency.code, { force })
  } catch {
    // Error state is shown in the modal.
  }
}

async function handleConvert() {
  if (!props.currency?.code) return
  try {
    await convert(props.currency.code, amount.value)
  } catch {
    // Conversion errors are shown below the input.
  }
}
</script>
