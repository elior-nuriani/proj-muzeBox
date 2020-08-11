import Vue from 'vue'
import Vuex from 'vuex'

import roomStore from '../modules/roomStore';
import userStore from '../modules/userStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    roomStore,
    userStore
  }
})
