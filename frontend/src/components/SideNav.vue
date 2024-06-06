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
      <div class="flex flex-col gap-3" v-for="(nav, ndx) in navs" :key="ndx">
        <RouterLink
          class="px-5 py-3 flex gap-3 items-center"
          :to="{ name: nav.route }"
          active-class="bg-dark-blue font-bold"
          @click="onRouteClick(nav.route)"
        >
          <div class="flex-1 flex gap-3">
            <img :src="nav.icon" alt="" />
            {{ nav.text }}
          </div>
          <img
            v-if="nav.children"
            class="w-6 h-6"
            src="../assets/icons/carret-down.svg"
            alt="carret"
          />
        </RouterLink>
        <div v-if="nav.children" class="flex flex-col gap-3 pl-8">
          <RouterLink
            v-for="(child, child_ndx) in nav.children"
            :key="child_ndx"
            class="px-5 py-2 flex gap-3 w-fit rounded-lg text-sm"
            :to="{ name: child.route }"
            active-class="bg-dark-blue font-bold"
            @click="onRouteClick(child.route)"
          >
            <img :src="child.icon" alt="" />
            {{ child.text }}
          </RouterLink>
        </div>
      </div>
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
import settings from "@/assets/icons/settings.svg";
import dot from "@/assets/icons/dot.svg";

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
  {
    text: "Settings",
    route: "product-categories",
    icon: settings,
    children: [
      {
        text: "Product Categories",
        route: "product-categories",
        icon: dot,
      },
    ],
  },
];

const route = useRoute();
const appStore = useAppStore();

const onRouteClick = (name = route.name) => {
  appStore.currentNav = navs.find((r) => r.route == name);
  console.log(appStore.currentNav);
};

// run function upon loading
onRouteClick();
</script>
