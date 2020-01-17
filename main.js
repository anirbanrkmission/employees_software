import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { ClientTable} from '../node_modules/vue-tables-2'
import vuetify from './plugins/vuetify';

Vue.use(ClientTable)
Vue.use(axios, VueAxios)
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')