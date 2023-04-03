<template>
  <div class="card p-4 center-screen">
    <div class="row">
      <div class="col-4 d-flex justify-content-center align-items-center">
        <img
          src="/lampart-logo.jpg"
          style="height: auto; width: auto; max-width: 70%; max-height: 80%"
        />
      </div>
      <div class="col-8 d-flex justify-content-start align-items-center">
        <form class="flex-fill" @submit.prevent="onHandle()">
          <h5 class="text-center">Login</h5>
          <div class="form-group">
            <label>Email address</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button class="btn btn-sm btn-primary btn-block">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SignIn",
  data() {
    return {
      email: null,
      password: null,
    };
  },

  methods: {
    ...mapActions(["login"]),

    onHandle() {
      let user = {
        email: this.email,
        password: this.password,
      };
      this.login({ user });
    },
  },
};
</script>

<style>
.center-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
