import axios from "axios";
import Auth from "../../plugins/auth";
import router from "../../router";

export const userStore = {
  state: {
    users: [],
    user: {},
    loading: true,
  },

  getters: {
    getUsers: (state) => state.users,
    getUser: (state) => state.user,
    getUserLoading: (state) => state.loading,
  },

  mutations: {
    setUsers: (state, users) => (state.users = users),
    setUser: (state, user) => (state.user = user),
    appendUser: (state, user) => {
      user.role = user.role.name;
      state.users.push(user);
    },
    editUser: (state, user) => {
      user.role = user.role.name;
      const index = state.users.findIndex((users) => users.id === user.id);
      state.users.splice(index, 1, user);
    },
    replicateUser: () => {},
    removeUser: (state, user) => {
      user.role = user.role.name;
      const index = state.users.findIndex((users) => users.id === user.id);
      state.users.splice(index, 1, user);
    },
    setUserLoading: (state, loading) => (state.loading = loading),
  },

  actions: {
    async getAllUsers({ commit }) {
      let url = `http://127.0.0.1:8000/api/users`;

      await axios.get(url).then((response) => {
        commit("setUsers", response.data.data);
        commit("setUserLoading", false);
      });
    },

    async addUser({ commit }, payload = { user: {} }) {
      let formData = new FormData();
      formData.append("name", payload.user.name);
      formData.append("email", payload.user.email);
      formData.append("password", payload.user.password);
      formData.append("role_id", payload.user.role_id);
      formData.append("active", payload.user.active);

      let url = "http://127.0.0.1:8000/api/users";
      await axios
        .post(url, formData)
        .then((response) => {
          if (response.data.status) {
            commit("appendUser", response.data.user);
            this._vm.$toast.success("Add successful");
          } else this._vm.$toast.error(response.data.message);
        })
        .catch(() => {
          this._vm.$toast.error("Add failed");
        });
    },

    async updateUser({ commit }, payload = { user: {} }) {
      let formData = new FormData();
      formData.append("name", payload.user.name);
      formData.append("role_id", payload.user.role_id);
      formData.append("active", payload.user.active);
      formData.append("_method", "PATCH");
      let url = `http://127.0.0.1:8000/api/users/${payload.user.id}`;

      await axios
        .post(url, formData)
        .then((response) => {
          if (response.data.status) {
            commit("editUser", response.data.user);
            this._vm.$toast.success("Update successful");
          } else this._vm.$toast.error(response.data.message);
        })
        .catch((e) => {
          this._vm.$toast.error("Update failed");
          console.log(e);
        });
    },

    async disableUser({ commit }, payload = { id: null }) {
      let url = `http://127.0.0.1:8000/api/users/${payload.id}`;
      await axios
        .post(url)
        .then((response) => {
          if (response.data.status) {
            commit("editUser", response.data.user);
            this._vm.$toast.success("Disable successful");
          } else this._vm.$toast.error("Disable failed");
        })
        .catch(() => {
          this._vm.$toast.error("Disable failed");
        });
    },

    async login({ commit }, payload = { user: null }) {
      let formData = new FormData();
      formData.append("email", payload.user.email);
      formData.append("password", payload.user.password);

      let url = "http://127.0.0.1:8000/api/login";
      await axios
        .post(url, formData)
        .then((response) => {
          if (response.data.status) {
            commit("setUser");
            Auth.login(response.data.token, response.data.current_user);
            router.push("users");
            this._vm.$toast.success("Login successful");
          } else this._vm.$toast.error(response.data.message);
        })
        .catch(() => {
          this._vm.$toast.error("Login failed");
        });
    },

    async logout({ commit }) {
      let url = `http://127.0.0.1:8000/api/logout`;
      await axios
        .post(url)
        .then(() => {
          commit("setUser");
          Auth.logout();
          router.push("login");
          this._vm.$toast.success("Logout successful");
        })
        .catch(() => {
          this._vm.$toast.error("Logout failed");
        });
    },
  },
};
