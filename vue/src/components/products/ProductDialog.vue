<template>
  <v-row justify="center" class="m-0 p-0">
    <v-dialog v-model="show" persistent max-width="400px">
      <v-card>
        <form>
          <v-card-title>
            <slot name="header" class="text-h5">Default header</slot>
          </v-card-title>
          <v-divider class="m-0 p-0"></v-divider>
          <v-card-text
            v-if="action == 'add' || action == 'upd' || action == 'det'"
          >
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    dense
                    label="Name"
                    :error-messages="nameErrors"
                    :disabled="action === 'det' ? true : false"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="category"
                    item-text="CategoryName"
                    item-value="CategoryID"
                    :items="categories"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :disabled="action === 'det' ? true : false"
                    :error-messages="categoryErrors"
                    @change="$v.category.$touch()"
                    @blur="$v.category.$touch()"
                    label="Category"
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="file"
                    accept="image/png, image/jpeg, image/jpg"
                    :disabled="action === 'det' ? true : false"
                    :label="action !== 'add' ? product.Image : 'Upload image'"
                    :placeholder="
                      product.Image != null ? product.Image : 'Upload image'
                    "
                    single-line
                    focused
                    show-size
                    dense
                    truncate-length="20"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text v-if="action == 'copy' || action == 'del'">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <h6 class="text-center" v-if="action == 'copy'">
                    Are you sure want to copy
                  </h6>
                  <h6 class="text-center" v-if="action == 'del'">
                    Are you sure want to delete
                  </h6>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider class="m-0 p-0"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              class="mb-2"
              elevation="2"
              small
              v-blur
              color="primary"
              v-if="action == 'add' || action == 'upd'"
              :hidden="action === 'det' ? true : false"
              @click.prevent="onHandle"
            >
              Save
            </v-btn>
            <v-btn
              type="submit"
              class="mb-2"
              elevation="2"
              small
              v-blur
              :color="action == 'copy' ? 'primary' : 'error'"
              v-if="action == 'copy' || action == 'del'"
              @click.prevent="onHandle"
            >
              Confirm
            </v-btn>
            <v-btn
              type="button"
              class="mr-5 mb-3"
              elevation="2"
              small
              v-blur
              color="warning"
              @click.stop="closeDialog"
            >
              Back
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import axios from "axios";
import { EventBus } from "../../main";

export default {
  name: "ProductDialog",

  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(30) },
    category: { required },
  },

  data() {
    return {
      product: {},
      categories: [],

      name: null,
      category: null,
      file: null,
      show: false,
    };
  },

  props: {
    action: String,
    productSelected: Object,
    dialog: Boolean,
  },

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 30 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },

    categoryErrors() {
      const errors = [];
      if (!this.$v.category.$dirty) return errors;
      !this.$v.category.required && errors.push("Category is required");
      return errors;
    },

    ...mapGetters({
      versionable: "getProductVersionable",
    }),
  },

  methods: {
    ...mapActions([
      "getProducts",
      "addProduct",
      "updateProduct",
      "copyProduct",
      "deleteProduct",
    ]),

    setProduct() {
      this.product.ProductName = this.name;
      this.product.CategoryID = this.category;
    },

    onHandle() {
      if (this.action == "add" || this.action == "upd") {
        this.$v.$touch();
        if (this.$v.$invalid) return;
      }

      if (this.action == "add") {
        this.setProduct();
        this.addProduct({ product: this.product, file: this.file });
        this.resetField();
      }

      if (this.action == "upd") {
        this.setProduct();
        this.updateProduct({
          product: this.product,
          versionable: this.versionable,
          file: this.file,
        });
      }

      if (this.action == "copy") {
        this.copyProduct({ id: this.productSelected.ProductID });
        this.closeDialog();
      }

      if (this.action === "del") {
        this.deleteProduct({ id: this.productSelected.ProductID });
        this.closeDialog();
      }
    },

    closeDialog() {
      EventBus.$emit("close");
    },

    resetField() {
      this.product = {};
      this.name = "";
      this.categories = null;
      this.file = null;
      this.$v.$reset();
    },

    async prepareData() {
      if (this.action == "add" || this.action == "det") {
        let url = `http://127.0.0.1:8000/api/products/create`;
        await axios.get(url).then((response) => {
          this.categories = response.data.categories;
        });
      } else {
        let url = `http://127.0.0.1:8000/api/products/edit/${this.productSelected.ProductID}`;
        await axios.get(url).then((response) => {
          this.categories = response.data.categories;
          this.$store.state.versionable = this.$store.commit(
            "setProductVersionable",
            response.data.versionable
          );
        });
      }
    },
  },

  created() {
    this.show = this.dialog;
    if (this.action == "add" || this.action == "upd" || this.action == "det") {
      this.prepareData();
      this.product = this.productSelected;
      this.name = this.product.ProductName;
      this.category = this.product.CategoryID;
    }
  },
};
</script>

<style scoped></style>
