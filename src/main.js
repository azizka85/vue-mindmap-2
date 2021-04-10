import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import './assets/styles.scss';

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app');
