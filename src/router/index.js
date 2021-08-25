import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
let routes = [];
let matches = require.context('../views', true, /\.router\.js$/)
matches.keys().forEach(key => {
  routes = routes.concat(matches(key).default)
})
routes.push({
  path: '*',
  name: 'home',
  component: () => import('@views/home/index.vue')
})
const router = new VueRouter({
  routes
})
// router.beforeEach((to, from, next) => {

//   next()

// })
export default router