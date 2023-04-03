<template>
  <div class="container mt-0">
    <h4 class="text-center">List of users</h4>

    <v-card elevation="2">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          v-blur
          fab
          x-small
          class="mr-3 mt-2"
          elevation="2"
          color="success"
          @click.stop="openDialog('add', {}, '40vw')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <vue-custom-scrollbar class="scroll-area" :settings="settings">
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          :loading="loading"
          loading-text="Fetching data... Please wait"
        >
          <template v-slot:[`item.role`]="{ item }">
            <v-chip color="primary" small>
              {{ item.role }}
            </v-chip>
          </template>

          <template v-slot:[`item.active`]="{ item }">
            <v-chip v-if="item.active" class="text-white" color="green" small>
              Active
            </v-chip>
            <v-chip v-else color="red" text-color="white" small>
              Disable
            </v-chip>
          </template>

          <template v-slot:[`item.operations`]="{ item }">
            <v-icon small class="mr-2" @click="openDialog('det', item, '40vw')">
              mdi-eye
            </v-icon>
            <v-icon small class="mr-2" @click="openDialog('upd', item, '40vw')">
              mdi-pencil
            </v-icon>
            <v-icon
              small
              class="mr-2"
              @click="openDialog('copy', item, '400px')"
            >
              mdi-content-copy
            </v-icon>
            <v-icon small @click="openDialog('dis', item, '400px')">
              mdi-block-helper
            </v-icon>
          </template>
        </v-data-table>
      </vue-custom-scrollbar>
    </v-card>
    <UserDialog
      v-if="dialog"
      :dialog="dialog"
      :action="action"
      :userSelected="user"
      :width="width"
    >
      <h3 v-if="action === 'add'" slot="header">Add User</h3>
      <h3 v-if="action === 'upd'" slot="header">Edit User</h3>
      <h3 v-if="action === 'copy'" slot="header">Copy User</h3>
      <h3 v-if="action === 'dis'" slot="header">Disable User</h3>
      <h3 v-if="action === 'det'" slot="header">Show User</h3>
    </UserDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vueCustomScrollbar from "vue-custom-scrollbar";
import { mapActions } from "vuex";
import UserDialog from "./UserDialog.vue";
import { EventBus } from "../../main";

export default {
  name: "UserList",

  components: {
    vueCustomScrollbar,
    UserDialog,
  },

  data() {
    return {
      search: "",
      user: {},
      action: "",
      dialog: false,
      headers: [
        {
          text: "#",
          filterable: false,
          value: "id",
          width: "5%",
        },
        { text: "Name", value: "name", width: "25%" },
        { text: "Email", value: "email", width: "25%" },
        { text: "Role", align: "center", value: "role", width: "15%" },
        {
          text: "Active",
          align: "center",
          width: "15%",
          value: "active",
        },
        {
          text: "Operation",
          align: "center",
          width: "15%",
          value: "operations",
          filterable: false,
          sortable: false,
        },
      ],
      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false,
      },
    };
  },

  computed: {
    ...mapGetters({
      users: "getUsers",
      loading: "getUserLoading",
    }),
  },

  methods: {
    ...mapActions(["getAllUsers"]),

    openDialog(action, user, width) {
      this.action = action;
      this.user = user;
      this.width = width;
      this.dialog = true;
    },
  },

  created() {
    this.getAllUsers();

    EventBus.$on("close", () => {
      this.dialog = false;
    });
  },
};
</script>

<style scoped>
.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: 65vh;
}
</style>
