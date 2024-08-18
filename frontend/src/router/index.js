import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/stores/auth";

import commonRoutes from "./common";
import inventoryRoutes from "./inventory";
import settingsRoutes from "./settings";

const router = createRouter({
  history: createWebHistory(),
  routes: [...commonRoutes, ...inventoryRoutes, ...settingsRoutes],
});

router.beforeEach(async (to, from, next) => {
  const isAuth = await isAuthenticated();

  if (to.meta.requiresAuth) {
    if (isAuth) {
      next();
    } else {
      if (to.name == "login") {
        next();
        return;
      } else {
        next({ name: "login" });
        return;
      }
    }
  } else {
    next();
  }
});

export default router;
