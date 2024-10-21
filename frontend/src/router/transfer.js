export default [
  {
    path: "/transfer",
    name: "transfer",
    component: () => import("@/layout/NavLayout.vue"),
    redirect: {
      name: "str-list",
    },
    children: [
      {
        path: "/ibrr-list",
        name: "ibrr-list",
        component: () => import("@/views/StockTransfer/ibrr-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Inter Branch Receive Report List",
        },
      },
      {
        path: "/ibrr-form",
        name: "ibrr-form",
        component: () => import("@/views/StockTransfer/ibrr-form.vue"),
        meta: {
          requiresAuth: true,
          title: "Inter Branch Receive Report Form",
        },
      },
      {
        path: "/str-list",
        name: "str-list",
        component: () => import("@/views/StockTransfer/str-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Stock Transfer Report List",
        },
      },
      {
        path: "/str-form",
        name: "str-form",
        component: () => import("@/views/StockTransfer/str-form.vue"),
        meta: {
          requiresAuth: true,
          title: "Stock Transfer Report Form",
        },
      },
    ],
  },
];