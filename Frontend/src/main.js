import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import pinia from './plugins/pinia'
import router from './routes/router'
import Header from './components/Header.vue'
import api from './plugins/api'

import 'sweetalert2/dist/sweetalert2.min.css';


const app=createApp(App)
app.component('Header',Header)
app.config.globalProperties.$api=api
app.use(vuetify).use(pinia).use(router).mount('#app')
