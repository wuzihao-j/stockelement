import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import routers from './routers.js'

Vue.use(VueResource);
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(routers)

const router = new VueRouter({
    mode: 'history',
    routes: routers
})


new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

