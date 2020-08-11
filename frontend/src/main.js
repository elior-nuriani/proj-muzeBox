import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './styles/global.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faThumbsUp, faThumbsDown, faLongArrowAltRight, faStar, faPlayCircle, faListUl, faUsers, faLock, faPlus, faEye, faSync, faAngleDoubleRight, faAngleRight, faRandom, faLongArrowAltLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './services/helpers';

import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css'

import VueCarousel from 'vue-carousel';

import AOS from 'aos'
import 'aos/dist/aos.css' 

Vue.use(VueCarousel);
Vue.use(VueAwesomeSwiper)

library.add(faEllipsisV, faRandom, faUsers,faAngleDoubleRight,faAngleRight, faSync, faLock, faUserSecret,faPlus, faThumbsUp, faThumbsDown, faLongArrowAltRight, faLongArrowAltLeft,faStar, faPlayCircle, faListUl,faEye);
Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

new Vue({
  created(){AOS.init()},
  router,
  store,
  render: h => h(App)
}).$mount('#app')
