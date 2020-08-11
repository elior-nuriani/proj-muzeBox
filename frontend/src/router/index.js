import Vue from 'vue'
import VueRouter from 'vue-router'
import Homepage from '../views/Homepage.vue';
import About from '../views/About.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue'
import RoomDetails from '../views/RoomDetails.vue'
import UserProfile from '../views/UserProfile.vue'
// import UserSettings from '../views/UserSettings'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Homepage
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/signup',
    component: Signup
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/details/:id',
    component: RoomDetails
  },
  {
    path: '/user/:id',
    component: UserProfile
  },
  // {
  //   path: '/settings',
  //   component:UserSettings
  // }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router;
