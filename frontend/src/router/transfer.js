export default [
  {
    path: "/transfer",
    name: "transfer",
    component: () => import("@/layout/NavLayout.vue"),
    redirect: {
      name: "ibrr-list",
    },
    children: [
      {
        path: "/ibrr-list",
        name: "ibrr-list",
        component: () => import("@/views/StockTransfer/ibrr-list.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/str-list",
        name: "str-list",
        component: () => import("@/views/StockTransfer/str-list.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];
