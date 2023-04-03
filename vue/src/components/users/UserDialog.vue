<template>
  <v-row justify="center" class="m-0 p-0">
    <v-dialog v-model="show" persistent :max-width="width">
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
                <v-col cols="6">
                  <v-select
                    v-model="role"
                    item-text="name"
                    item-value="id"
                    :items="roles"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :disabled="action === 'det' ? true : false"
                    :error-messages="roleErrors"
                    @blur="$v.role.$touch()"
                    label="Role"
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="active"
                    item-text="name"
                    item-value="value"
                    :items="actives"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :disabled="action === 'det' ? true : false"
                    label="Active"
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    :error-messages="nameErrors"
                    :disabled="action === 'det' ? true : false"
                    @blur="$v.name.$touch()"
                    @input="$v.name.$touch()"
                    label="Name"
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="action != 'upd'">
                  <v-text-field
                    v-model="email"
                    :error-messages="emailErrors"
                    :disabled="action === 'det' ? true : false"
                    @blur="$v.email.$touch()"
                    label="Email"
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" v-if="action == 'add'">
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    hint="At least 8 characters, 1 numeric, 1 uppercase, 1 lowercase, 1 special character"
                    :error-messages="passwordErrors"
                    :disabled="action === 'det' ? true : false"
                    @click:append="showPassword = !showPassword"
                    label="Password"
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text v-if="action == 'copy' || action == 'dis'">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <h6 class="text-center" v-if="action == 'copy'">
                    Are you sure want to copy
                  </h6>
                  <h6 class="text-center" v-if="action == 'dis'">
                    Are you sure want to disable user
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
              v-if="action == 'copy' || action == 'dis'"
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
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
} from "vuelidate/lib/validators";
import axios from "axios";
import { EventBus } from "../../main";

export default {
  name: "UserDialog",

  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(30) },
    email: { required, email, maxLength: maxLength(30) },
    password: {
      required,
      valid: function (value) {
        const containsUppercase = /[A-Z]/.test(value);
        const containsLowercase = /[a-z]/.test(value);
        const containsNumber = /[0-9]/.test(value);
        const containsSpecial = /[#?!@$%^&*-]/.test(value);
        return (
          containsUppercase &&
          containsLowercase &&
          containsNumber &&
          containsSpecial
        );
      },
      minLength: minLength(8),
    },
    role: { required },
  },

  data() {
    return {
      user: {},
      roles: [],
      actives: [
        {
          name: "Enable",
          value: 1,
        },
        {
          name: "Disabled",
          value: 0,
        },
      ],

      name: null,
      email: null,
      password: null,
      role: null,
      active: true,
      show: false,
      showPassword: false,
    };
  },

  props: {
    action: String,
    userSelected: Object,
    dialog: Boolean,
    width: String,
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

    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.maxLength &&
        errors.push("Email must be at most 30 characters long");
      !this.$v.email.required && errors.push("Email is required.");
      !this.$v.email.email && errors.push("Invalid email");
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      (!this.$v.password.minLength ||
        !this.$v.password.required ||
        !this.$v.password.valid) &&
        errors.push("Invalid Password");
      return errors;
    },

    roleErrors() {
      const errors = [];
      if (!this.$v.role.$dirty) return errors;
      !this.$v.role.required && errors.push("Role is required");
      return errors;
    },
  },

  methods: {
    ...mapActions([
      "getUsers",
      "addUser",
      "updateUser",
      "copyUser",
      "disableUser",
    ]),

    setUser() {
      this.user.name = this.name;
      this.user.email = this.email;
      this.user.password = this.password;
      this.user.role_id = this.role;
      this.user.active = this.active;
    },

    onHandle() {
      if (this.action == "add") {
        this.$v.$touch();
        if (this.$v.$invalid) return;
      } else if (this.action == "upd") {
        this.$v.name.$touch();
        this.$v.role.$touch();
        if (this.$v.name.$invalid || this.$v.role.$invalid) return;
      }

      if (this.action == "add") {
        this.setUser();
        this.addUser({ user: this.user });
        this.resetField();
      }

      if (this.action == "upd") {
        this.setUser();
        this.updateUser({ user: this.user });
      }

      if (this.action == "copy") {
        this.copyUser({ id: this.userSelected.id });
        this.closeDialog();
      }

      if (this.action === "dis") {
        this.disableUser({ id: this.userSelected.id });
        this.closeDialog();
      }
    },

    closeDialog() {
      EventBus.$emit("close");
    },

    resetField() {
      this.user = {};
      this.name = "";
      this.email = "";
      this.password = "";
      this.role = null;
      this.active = true;
      this.$v.$reset();
    },

    async prepareData() {
      let url = `http://127.0.0.1:8000/api/users/preparedata`;
      await axios.get(url).then((response) => {
        this.roles = response.data.roles;
      });
    },
  },

  created() {
    this.show = this.dialog;
    if (this.action == "add" || this.action == "upd" || this.action == "det") {
      this.prepareData();

      this.user = this.userSelected;
      this.name = this.user.name;
      this.email = this.user.email;
      this.password = this.user.password;
      this.role = parseInt(this.user.role_id);
      this.active = this.action == "add" ? 1 : parseInt(this.user.active);
    }
  },
};
</script>

<style scoped></style>
