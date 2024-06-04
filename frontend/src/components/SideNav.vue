<template>
  <div class="w-64 fixed h-screen bg-regular-blue text-white">
    <!-- User Profile -->
    <div class="bg-lighter-blue flex p-3 items-center h-15">
      <div class="flex-1">
        <p>Administrator</p>
        <p class="text-xs text-[#ADB3B9]">admin</p>
      </div>
      <img
        class="w-12 h-12 rounded-full"
        src="../assets/images/profile-sample.png"
        alt="profile"
      />
    </div>

    <!-- Navigations -->
    <div class="mt-5">
      <RouterLink
        v-for="(nav, ndx) in navs"
        :key="ndx"
        class="px-5 py-3 flex gap-3"
        :to="{ name: nav.route }"
        active-class="bg-dark-blue font-bold"
        @click="onRouteClick(nav.route)"
      >
        <img :src="nav.icon" alt="" />
        {{ nav.text }}
      </RouterLink>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";

import dashboard from "@/assets/icons/dashboard.svg";
import inventory from "@/assets/icons/inventory.svg";
import vendors from "@/assets/icons/vendors.svg";
import customers from "@/assets/icons/customers.svg";
import products from "@/assets/icons/products.svg";
import reports from "@/assets/icons/reports.svg";
import employees from "@/assets/icons/employees.svg";

const navs = [
  {
    text: "Dashboard",
    route: "dashboard",
    icon: dashboard,
  },
  {
    text: "Inventory",
    route: "inventory",
    icon: inventory,
  },
  {
    text: "Vendors/Suppliers",
    route: "vendors",
    icon: vendors,
  },
  {
    text: "Customers",
    route: "customers",
    icon: customers,
  },
  {
    text: "Products",
    route: "products",
    icon: products,
  },
  {
    text: "Reports",
    route: "reports",
    icon: reports,
  },
  {
    text: "Employees",
    route: "employees",
    icon: employees,
  },
];

const route = useRoute();
const appStore = useAppStore();

const onRouteClick = (name = route.name) => {
  appStore.currentNav = navs.find((r) => r.route == name);
};

// run function upon loading
onRouteClick();
</script>
