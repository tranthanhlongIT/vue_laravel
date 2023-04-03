import Vuex from "vuex";
import Vue from "vue";
import { productStore } from "./modules/products";
// import { categoryStore } from "./modules/categories";
import { userStore } from "./modules/users";

Vue.use(Vuex);
export const store = new Vuex.Store({
  modules: {
    product: productStore,
    // category: categoryStore,
    user: userStore,
  },
});
