import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import DeathRate from '../views/DeathRate.vue'
import Death from '../views/Death.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/death-rate',
    name: 'DeathRate',
    component: DeathRate
  },
  {
    path: '/death',
    name: 'Death',
    component: Death
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
