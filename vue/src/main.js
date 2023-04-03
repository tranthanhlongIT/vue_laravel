import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as common from "./plugins/common";
import axios from "axios";
import VueAxios from "vue-axios";
import { store } from "./store/index";
import Vuex from "vuex";
import vuetify from "./plugins/vuetify.js";
import Auth from "./plugins/auth";
import "vue-custom-scrollbar/dist/vueScrollbar.css";

Vue.use(Vuex);

Vue.use(VueAxios, axios);

Vue.prototype.auth = Auth;

Vue.config.productionTip = false;

export const EventBus = new Vue();

new Vue({
  vuetify,
  router,
  common,
  store,
  render: (h) => h(App),
}).$mount("#app");
