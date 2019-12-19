import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from "axios"
import TreeTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})

Vue.prototype.$http = axios;
Vue.use(axios);
Vue.use(ElementUi);
Vue.config.productionTip = false;

Vue.component('tree-table',TreeTable);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
