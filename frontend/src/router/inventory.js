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
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/purchase-order",
        name: "purchase-order",
        component: () => import("@/views/Inventory/PurchaseOrder.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/inventory-stock-status",
        name: "inventory-stock-status",
        component: () =>
          import("@/views/Inventory/InventoryStockStatusPage.vue"),
        meta: {
          title: "Inventory Stock Status Page",
          requiresAuth: true,
        },
      },
      {
        path: "/purchase-order-create",
        name: "purchase-order-create",
        component: () => import("@/views/Inventory/PurchaseOrderForm.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/purchase-receive-order/:id",
        name: "purchase-receive-order",
        component: () => import("@/views/Inventory/ReceiveOrder.vue"),
        meta: {
          title: "Receive Order",
          requiresAuth: true,
        },
      },
      {
        path: "/physical-inventory-details/:id",
        name: "physical-inventory-details",
        component: () =>
          import("@/views/Inventory/PhysicalInventoryDetails.vue"),
        meta: {
          title: "Physical Inventory",
          requiresAuth: true,
        },
      },
    ],
  },
];
