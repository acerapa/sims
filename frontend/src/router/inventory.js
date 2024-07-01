export default [
  {
    path: "/inventory",
    name: "inventory",
    component: () => import("@/layout/NavLayout.vue"),
    redirect: {
      name: "purchase-order",
    },
    children: [
      {
        path: "/my-inventory",
        name: "my-inventory",
        component: () => import("@/views/Inventory/Inventory.vue"),
      },
      {
        path: "/purchase-order",
        name: "purchase-order",
        component: () => import("@/views/Inventory/PurchaseOrder.vue"),
      },
      {
        path: "/purchase-order-create",
        name: "purchase-order-create",
        component: () => import("@/views/Inventory/PurchaseOrderForm.vue"),
      },
    ],
  },
];
