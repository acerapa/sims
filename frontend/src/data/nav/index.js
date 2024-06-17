import dashboard from "@/assets/icons/dashboard.svg";
import inventory from "@/assets/icons/inventory.svg";
import vendors from "@/assets/icons/vendors.svg";
import customers from "@/assets/icons/customers.svg";
import products from "@/assets/icons/products.svg";
import reports from "@/assets/icons/reports.svg";
import employees from "@/assets/icons/employees.svg";
import settings from "@/assets/icons/settings.svg";
import dot from "@/assets/icons/dot.svg";

export default [
  {
    text: "Dashboard",
    route: "dashboard",
    icon: dashboard,
  },
  {
    text: "Inventory",
    route: "inventory",
    icon: inventory,
    children: [
      {
        text: "Purchase Order",
        route: "purchase-order",
        icon: dot,
      },
      {
        text: "My Inventory",
        route: "my-inventory",
        icon: dot,
      },
    ],
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
    route: "setting",
    icon: settings,
    children: [
      {
        text: "Account Settings",
        route: "account-settings",
        icon: dot,
      },
      {
        text: "Product Categories",
        route: "product-categories",
        icon: dot,
      },
    ],
  },
];
