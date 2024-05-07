import Vue from 'vue'
import Piano from './Piano.vue'
import App from "./App.vue"
import store from './store'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router';
import Axios from 'axios'

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.header.commit["Authorization"] = token;
}


Vue.config.productionTip = false

import Login from './components/auth/login.vue'
import Register from './components/auth/register.vue'
import Resource from './components/resources/resources.vue'


const routes = [
  { path: "/", component: Piano, },
  { path: "/login", component: Login, },
  { path: "/register", component: Register, },
  { path: "/resources", component: Resource },
]

// let router = new Router({
//   mode: 'history',
//   routes: [
//     {
//       path: '/login',
//       name: 'login',
//       component: Login,
//     },
//     {
//       path: '/register',
//       name: 'register',
//       component: Register
//     },
//     {
//       path: '/resources',
//       name: 'resources',
//       component: Resource,
//       meta: {
//         requiresAuth: true
//       }
//     }
//   ]
// })

const router = new VueRouter({
  routes: routes,
  mode: "history",
})

export default router


Vue.use(VueRouter);

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
