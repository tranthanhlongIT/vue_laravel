import Vue from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Vuelidate from "vuelidate";

const options = {
  position: "bottom-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.5,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

Vue.use(Toast, options);
Vue.use(Vuelidate);
