<template>
  <div class="container mt-0">
    <h4 class="text-center">List of products</h4>
    <div class="d-flex">
      <div class="mr-auto col-4 pl-0 justify-content-start align-items-center">
        <div class="input-group input-group-sm">
          <form @submit.prevent="searchProduct()" class="w-100">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Search by name or category"
            />
          </form>
        </div>
      </div>
      <div class="d-flex justify-content-end align-items-center">
        <div class="text-center">
          <v-btn
            v-blur
            fab
            x-small
            class="mr-3 mt-2"
            elevation="2"
            color="success"
            @click.stop="openDialog('add', {})"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <vue-custom-scrollbar class="scroll-area" :settings="settings">
      <table class="table table-hover">
        <thead>
          <tr>
            <th style="width: 50px">#</th>
            <th class="text-start" style="width: 15%">Category</th>
            <th class="text-start" style="white-space: nowrap; width: auto">
              Product name
            </th>
            <th style="width: 20%">Image</th>
            <th style="width: 10%">Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.ProductID">
            <td>{{ product.ProductID }}</td>
            <td class="text-start">{{ product.CategoryName }}</td>
            <td class="text-start">{{ product.ProductName }}</td>
            <td>
              <img
                :src="`http://127.0.0.1:8000/api/storage/app/images/${product.Image}`"
                width="100"
                height="100"
              />
            </td>
            <td>
              <div class="d-inline-flex m-0 p-0">
                <v-btn
                  v-blur
                  fab
                  x-small
                  class="mr-3 mt-2"
                  elevation="2"
                  color="info"
                  @click.stop="openDialog('det', product)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-blur
                  fab
                  x-small
                  class="mr-3 mt-2"
                  elevation="2"
                  color="primary"
                  @click.stop="openDialog('upd', product)"
                >
                  <v-icon>mdi-pencil-box</v-icon>
                </v-btn>
                <v-btn
                  v-blur
                  fab
                  x-small
                  class="mr-3 mt-2"
                  elevation="2"
                  color="primary"
                  @click.stop="openDialog('copy', product)"
                >
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
                <v-btn
                  v-blur
                  fab
                  x-small
                  class="mr-3 mt-2"
                  elevation="2"
                  color="error"
                  @click.stop="openDialog('del', product)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </vue-custom-scrollbar>
    <ProductDialog
      v-if="dialog"
      :dialog="dialog"
      :action="action"
      :productSelected="product"
    >
      <h3 v-if="action === 'add'" slot="header">Add Product</h3>
      <h3 v-if="action === 'upd'" slot="header">Edit Product</h3>
      <h3 v-if="action === 'copy'" slot="header">Copy Product</h3>
      <h3 v-if="action === 'del'" slot="header">Delete Product</h3>
      <h3 v-if="action === 'det'" slot="header">Show Product</h3>
    </ProductDialog>
    <ProductPagination />
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import ProductPagination from "./ProductPagination.vue";
import vueCustomScrollbar from "vue-custom-scrollbar";
import ProductDialog from "./ProductDialog.vue";
import { mapGetters, mapActions } from "vuex";
import { EventBus } from "../../main";

export default {
  name: "ProductList",

  components: {
    ProductPagination,
    ProductDialog,
    vueCustomScrollbar,
  },

  data() {
    return {
      search: "",
      product: {},
      action: "",
      dialog: false,
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false,
      },
    };
  },

  computed: mapGetters({
    products: "getProducts",
    perPage: "getProductPerPage",
    total: "getProductTotal",
    currentPage: "getProductCurrentPage",
    overlay: "getProductOverlay",
  }),

  methods: {
    ...mapActions(["getAllProducts"]),

    searchProduct() {
      this.getAllProducts({
        currentPage: this.currentPage,
        search: this.search,
      });
    },

    openDialog(action, product) {
      this.action = action;
      this.product = product;
      this.dialog = true;
    },
  },

  created() {
    this.getAllProducts();

    EventBus.$on("close", () => {
      this.dialog = false;
      this.getAllProducts({ currentPage: this.currentPage, search: "" });
    });
  },
};
</script>

<style scoped>
.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: 60vh;
}
</style>
