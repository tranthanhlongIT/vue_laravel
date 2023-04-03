import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

Vue.directive("blur", {
  inserted: function (el) {
    el.onfocus = (ev) => ev.target.blur();
  },
});

const opts = {
  theme: {
    dark: false,
  },
  options: {
    customProperties: true,
  },
  icons: {
    iconfont: "mdi",
  },
};

export default new Vuetify(opts);
