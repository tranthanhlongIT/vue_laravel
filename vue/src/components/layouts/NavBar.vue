<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link
          to="/products"
          class="nav-link"
          :class="isActive('products')"
        >
          Products
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/users" class="nav-link" :class="isActive('users')">
          Users
        </router-link>
      </li>
    </div>
    <div class="navbar-nav">
      <li class="nav-item">
        <v-menu offset-y rounded="lg" dense>
          <template v-slot:activator="{ on, attrs }">
            <span class="nav-link active" v-bind="attrs" v-on="on"
              >Hello, {{ user.name }}</span
            >
          </template>
          <v-list>
            <v-list-item link>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-divider class="m-0 p0"></v-divider>
            <v-list-item link>
              <v-list-item-title>Change Password</v-list-item-title>
            </v-list-item>
            <v-divider class="m-0 p0"></v-divider>
            <v-list-item link>
              <v-list-item-title @click.prevent="logout"
                >Logout</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </li>
    </div>
  </nav>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NavBar",
  data() {
    return {
      user: this.auth.user,
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" },
      ],
    };
  },

  methods: {
    ...mapActions(["logout"]),

    isActive(path) {
      if (path === this.$route.name) {
        return "active";
      }
    },
  },
};
</script>

<style>
.hover-white:hover {
  color: white !important;
}
</style>
