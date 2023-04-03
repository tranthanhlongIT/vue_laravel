<template>
  <nav class="mt-2">
    <ul class="pagination pl-0">
      <li
        class="page-item"
        :class="disablePrevious() ? 'disabled' : ''"
        @click.stop="getAllProducts({ currentPage: prev, search: search })"
      >
        <a class="page-link" href="javascript:void(0)"
          ><span class="prevent-select">Previous</span></a
        >
      </li>
      <li
        v-for="page in range(start, end)"
        :key="page"
        class="page-item"
        :class="currentPage == page ? 'active' : ''"
        @click.stop="getAllProducts({ currentPage: page, search: search })"
      >
        <a class="page-link" href="javascript:void(0)"
          ><span class="prevent-select">{{ page }}</span></a
        >
      </li>
      <li
        class="page-item"
        :class="disableNext() ? 'disabled' : ''"
        @click.stop="getAllProducts({ currentPage: next, search: search })"
      >
        <a class="page-link" href="javascript:void(0)"
          ><span class="prevent-select">Next</span></a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProductPagination",

  data() {
    return {
      disabled: "",
    };
  },

  computed: {
    ...mapGetters({
      currentPage: "getProductCurrentPage",
      total: "getProductTotal",
      search: "getProductSearch",
      lastPage: "getProductLastPage",
      start: "getProductStart",
      end: "getProductEnd",
      next: "getProductNext",
      prev: "getProductPrev",
    }),
  },

  methods: {
    ...mapActions(["getAllProducts", "preparePagination"]),

    disablePrevious() {
      if (this.currentPage > 1 && this.lastPage > 1) return false;
      else return true;
    },

    disableNext() {
      if (this.currentPage < this.lastPage && this.lastPage > 1) return false;
      else return true;
    },

    range(start, end) {
      var array = [],
        j = 0;
      for (var i = start; i <= end; i++) {
        array[j] = i;
        j++;
      }
      return array;
    },
  },

  created() {
    this.preparePagination();
  },

  beforeUpdate() {
    this.preparePagination();
  },
};
</script>

<style scoped>
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
