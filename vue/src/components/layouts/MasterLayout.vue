<template>
  <v-app id="inspire">
    <NavBar />
    <router-view></router-view>
  </v-app>
</template>

<script>
import NavBar from "./NavBar";

export default {
  name: "MasterLayout",

  components: {
    NavBar,
  },
};
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: silver;
  border-radius: 10px;
  overflow: auto;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
</style>
