import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import ElementUI from "element-plus"
import "element-plus/dist/index.css"

import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(ElementUI)
app.mount('#app')
