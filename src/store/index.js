import Vue from 'vue'
import Vuex from 'vuex'
import Auth from '../warehouse/Auth';
import Uhhh from '../warehouse/Uhhh';
import Msgs from '../warehouse/Msgs';
import Socket from '../warehouse/Socket';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Auth,
    Uhhh,
    Msgs,
    Socket
  }
})
