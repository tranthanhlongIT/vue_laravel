import axios from "axios";
import Auth from "@/plugins/auth";
import router from "@/router";

export const productStore = {
  state: {
    products: [],
    product: {},
    search: "",

    start: 1,
    end: 1,
    next: 1,
    prev: 1,

    total: 0,
    currentPage: 1,
    lastPage: 1,

    versionable: null,
    overlay: true,
  },

  getters: {
    getProducts: (state) => state.products,
    getProduct: (state) => state.product,
    getProductTotal: (state) => state.total,
    getProductCurrentPage: (state) => state.currentPage,
    getProductLastPage: (state) => state.lastPage,
    getProductSearch: (state) => state.search,
    getProductVersionable: (state) => state.versionable,
    getProductStart: (state) => state.start,
    getProductEnd: (state) => state.end,
    getProductNext: (state) => state.next,
    getProductPrev: (state) => state.prev,
    getProductOverlay: (state) => state.overlay,
  },

  mutations: {
    setProducts: (state, products) => (state.products = products),
    setProduct: (state, product) => (state.product = product),
    setProductSearch: (state, search) => (state.search = search),

    setProductTotal: (state, total) => (state.total = total),
    setProductCurrentPage: (state, currentPage) =>
      (state.currentPage = currentPage),
    setProductLastPage: (state, lastPage) => (state.lastPage = lastPage),

    setProductStart: (state, start) => (state.start = start),
    setProductEnd: (state, end) => (state.end = end),
    setProductNext: (state, next) => (state.next = next),
    setProductPrev: (state, prev) => (state.prev = prev),

    appendProduct: () => {},
    editProduct: () => {},
    replicateProduct: () => {},
    removeProduct: (state, id) => {
      state.products = state.products.filter(
        (product) => product.ProductID != id
      );
    },

    preparePagination: (state) => {
      let currentPage = state.currentPage;
      let lastPage = state.lastPage;
      let start = currentPage - 1;
      let end = currentPage + 1;
      let next = currentPage + 2;
      let prev = currentPage - 2;

      if (start < 1) start = 1;
      if (end > lastPage) end = currentPage;

      if (next > lastPage) next = lastPage;
      if (prev < 1) prev = 1;

      if (currentPage == start && currentPage + 2 == next) {
        end++;
        next++;
      }

      if (currentPage == end && currentPage - 2 == prev) {
        start--;
        prev--;
      }

      if (currentPage > lastPage) end = lastPage;

      state.start = start;
      state.end = end;
      state.next = next;
      state.prev = prev;
    },

    setProductVersionable: (state, versionable) => {
      state.versionable = versionable;
    },
    setProductOverlay: (state, overlay) => {
      state.overlay = overlay;
    },
  },

  actions: {
    async getAllProducts(
      { commit, getters },
      payload = { currentPage: 1, search: "" }
    ) {
      await commit("setProductCurrentPage", payload.currentPage);
      await commit("setProductSearch", payload.search);

      let url = `http://127.0.0.1:8000/api/products?page=${getters.getProductCurrentPage}&search=${getters.getProductSearch}`;

      await axios
        .get(url)
        .then((response) => {
          commit("setProducts", response.data.data.data);
          commit("setProductTotal", response.data.data.total);
          commit("setProductLastPage", response.data.data.last_page);
          commit("setProductOverlay", false);
        })
        .catch((e) => {
          console.log(e.request.status);
        });
    },

    async addProduct({ commit }, payload = { product: {}, file: {} }) {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      let formData = new FormData();
      formData.append("productName", payload.product.ProductName);
      formData.append("categoryID", payload.product.CategoryID);
      formData.append("image", payload.file ?? "");

      let url = "http://127.0.0.1:8000/api/products";
      await axios
        .post(url, formData, config)
        .then((response) => {
          if (response.status == 401) {
            Auth.logout();
            router.push("login");
          }

          if (response.data.status) {
            commit("appendProduct");
            this._vm.$toast.success("Add successful");
          } else this._vm.$toast.error("Add failed");
        })
        .catch(() => {
          this._vm.$toast.error("Add failed");
        });
    },

    async updateProduct(
      { commit },
      payload = { product: {}, versionable: null, file: {} }
    ) {
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      let formData = new FormData();
      formData.append("_method", "PATCH");
      formData.append("productName", payload.product.ProductName);
      formData.append("categoryID", payload.product.CategoryID);
      formData.append("Versionable", payload.versionable);
      if (payload.file != null) formData.append("image", payload.file);

      let url = `http://127.0.0.1:8000/api/products/${payload.product.ProductID}`;
      await axios
        .post(url, formData, config)
        .then((response) => {
          if (response.status == 401) {
            Auth.logout();
            router.push("login");
          }

          if (response.data.status) {
            commit("editProduct");
            commit("setProductVersionable", response.data.versionable);
            this._vm.$toast.success("Update successful");
          } else this._vm.$toast.error(response.data.message);
        })
        .catch(() => {
          this._vm.$toast.error("Update failed");
        });
    },

    async copyProduct({ commit }, payload = { id: null }) {
      let url = `http://127.0.0.1:8000/api/products/copy/${payload.id}`;
      await axios
        .post(url)
        .then((response) => {
          if (response.status == 401) {
            Auth.logout();
            router.push("login");
          }

          if (response.data.status) {
            commit("replicateProduct");
            this._vm.$toast.success("Copy successful");
          } else this._vm.$toast.error("Copy failed");
        })
        .catch(() => {
          this._vm.$toast.error("Copy failed");
        });
    },

    async deleteProduct({ commit }, payload = { id: null }) {
      let url = `http://127.0.0.1:8000/api/products/${payload.id}`;
      await axios
        .delete(url)
        .then((response) => {
          if (response.status == 401) {
            Auth.logout();
            router.push("login");
          }

          if (response.data.status) {
            commit("removeProduct", payload.id);
            this._vm.$toast.success("Delete successful");
          } else this._vm.$toast.error("Delete failed");
        })
        .catch(() => {
          this._vm.$toast.error("Delete failed");
        });
    },

    async preparePagination({ commit }) {
      commit("preparePagination");
    },
  },
};
