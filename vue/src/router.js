import Vue from "vue";
import Router from "vue-router";
import Auth from "./plugins/auth";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: () => import("./components/layouts/MasterLayout"),
    children: [
      {
        alias: "/",
        path: "products",
        name: "products",
        component: () => import("./components/products/ProductList.vue"),
      },
      {
        path: "users",
        name: "users",
        component: () => import("./components/users/UserList.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./components/layouts/SignIn.vue"),
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "*",
    name: "errors",
    component: () => import("./components/layouts/NotFound"),
  },
];

const router = new Router({
  mode: "history",
  routes: routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (Auth.check()) {
      next();
    } else {
      router.push("login");
    }
  } else if (to.matched.some((record) => record.meta.requiresVisitor)) {
    if (Auth.check()) {
      router.push("products");
    } else {
      next();
    }
  } else next();
});

export default router;
