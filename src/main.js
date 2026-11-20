import { createApp } from 'vue'
import {
  Quasar,
  Notify,
  Dialog,
  Loading,
  QBanner,
  QBtn,
  QCard,
  QChip,
  QDialog,
  QIcon,
  QInnerLoading,
  QInput,
  QSelect,
  QSkeleton,
  QSpinner,
} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './css/app.scss'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(Quasar, {
    plugins: { Notify, Dialog, Loading },
    components: {
      QBanner,
      QBtn,
      QCard,
      QChip,
      QDialog,
      QIcon,
      QInnerLoading,
      QInput,
      QSelect,
      QSkeleton,
      QSpinner,
    },
    config: {
      brand: {
        primary: '#1976d2',
      },
    },
  })
  .use(router)
  .mount('#app')
