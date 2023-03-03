import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import ElementUI from "element-plus"
import "element-plus/dist/index.css"
import './assets/main.css'

import * as Icons from '@element-plus/icons-vue'
const app = createApp(App)

// 注册Icons 全局组件
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key])
})


const pinia = createPinia()

app.use(pinia)
app.use(ElementUI)
app.mount('#app')
