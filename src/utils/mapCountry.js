const regionNames = {
  Americas: 'América',
  Europe: 'Europa',
  Asia: 'Asia',
  Africa: 'África',
  Oceania: 'Oceanía',
}

function arrayFrom(value) {
  if (Array.isArray(value)) return value
  if (value == null) return []
  return [value]
}

function getCommonName(names) {
  if (typeof names === 'string') return names
  return names?.common ?? names?.official ?? 'País sin nombre'
}

function getCapital(capitals) {
  const capital = arrayFrom(capitals)[0]
  return typeof capital === 'string' ? capital : capital?.name ?? ''
}

function getCurrencies(currencies) {
  return arrayFrom(currencies).map((currency) => {
    if (typeof currency === 'string') return { code: currency, name: currency, symbol: '' }
    return {
      code: currency?.code ?? '',
      name: currency?.name ?? currency?.code ?? '',
      symbol: currency?.symbol ?? '',
    }
  }).filter((currency) => currency.code)
}

function getLanguages(languages) {
  return arrayFrom(languages).map((language) => {
    if (typeof language === 'string') return language
    return language?.name ?? ''
  }).filter(Boolean)
}

function getContinent(raw) {
  const subregion = raw?.subregion ?? ''
  if (subregion === 'South America') return 'Sudamérica'
  if (['North America', 'Central America', 'Caribbean'].includes(subregion)) return 'Norteamérica'

  const continent = arrayFrom(raw?.continents)[0]
  const region = raw?.region ?? continent
  return regionNames[region] ?? region ?? ''
}

function getArea(raw) {
  const area = raw?.area
  if (typeof area === 'number') return area
  return area?.kilometers ?? null
}

function getCallingCode(raw) {
  const codes = arrayFrom(raw?.calling_codes)
  if (codes.length) return codes.map((code) => `+${String(code).replace(/^\+/, '')}`).join(', ')
  const root = raw?.idd?.root ?? ''
  const suffixes = arrayFrom(raw?.idd?.suffixes)
  return root ? `${root}${suffixes[0] ?? ''}` : ''
}

export function mapCountry(raw = {}) {
  const codes = raw.codes ?? {}
  const carSide = raw.cars?.side ?? raw.driving_side
  const drivingSide = carSide === 'right' ? 'Derecha' : carSide === 'left' ? 'Izquierda' : ''
  const flagUrl = raw.flag?.url_png ?? raw.flags?.png
  const alpha2 = String(codes.alpha_2 ?? raw.cca2 ?? '').toLowerCase()

  return {
    name: getCommonName(raw.names ?? raw.name),
    alpha2,
    alpha3: codes.alpha_3 ?? raw.cca3 ?? '',
    capital: getCapital(raw.capitals ?? raw.capital),
    population: raw.population ?? null,
    continent: getContinent(raw),
    region: raw.region ?? '',
    subregion: raw.subregion ?? '',
    area: getArea(raw),
    currencies: getCurrencies(raw.currencies),
    languages: getLanguages(raw.languages),
    timezones: arrayFrom(raw.timezones),
    borders: arrayFrom(raw.borders),
    callingCode: getCallingCode(raw),
    domain: arrayFrom(raw.tlds ?? raw.tld)[0] ?? '',
    drivingSide,
    flagUrl: flagUrl ?? (alpha2 ? `https://flagcdn.com/w320/${alpha2}.png` : ''),
  }
}

export function mapCountries(response) {
  const records = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
    : Array.isArray(response?.data?.objects)
      ? response.data.objects
      : Array.isArray(response?.objects)
        ? response.objects
        : response?.data && !Array.isArray(response.data)
          ? [response.data]
          : response?.names || response?.codes || response?.cca2
            ? [response]
            : []
  return records.map(mapCountry)
}
