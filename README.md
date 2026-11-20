# Explorador de países

Aplicación frontend con Vue 3, Vite, Vue Router y Quasar. Consume los endpoints públicos autenticados de REST Countries para listar países, consultar el detalle y mostrar tasas/conversiones.

## Requisitos

- Node.js 20 o superior
- Una API key gratuita de [REST Countries](https://restcountries.com/sign-up)

## Instalación y ejecución

```bash
npm install
```

Copia `.env.example` a `.env` y configura la clave:

```env
VITE_API_KEY=tu_api_key
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Para validar la compilación de producción:

```bash
npm run build
```

## Estructura principal

- `src/components/`: tarjetas, grilla, detalle, estados y modal de moneda.
- `src/composables/`: estado y caché en memoria para países y monedas.
- `src/services/api.js`: instancias Axios autenticadas `countriesApi` y `currenciesApi`.
- `src/services/endpoints/`: funciones de acceso por API.
- `src/router/index.js`: listado en `/` y detalle en `/country/:code`.
- `src/utils/mapCountry.js`: normalización de campos de REST Countries.

La variable de entorno se usa en el cliente Vite según el requisito del proyecto; por tanto, la clave queda disponible en el bundle del navegador y no debe considerarse un secreto de producción.
