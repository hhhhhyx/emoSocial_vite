import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import '../src/plugins/fonts/font.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import GoEasy from "goeasy-lite";


const app = createApp(App)
app.use(ElementPlus)
app.use(router).mount('#app')
app.provide('GoEasy', GoEasy.getInstance({
    host: "hangzhou.goeasy.io",  
    appkey: "BC-9b238fc27dd8431da777e4edd3deedbb",
    modules: ['pubsub']
}))
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}