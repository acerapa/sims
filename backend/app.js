const express = require("express");
const app = express();
const cors = require("cors");

// enable env config
require("dotenv").config();

const port = process.env.PORT || 3000;

// setting ups
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// trigger database connection
require("./models");

// response formatter
const { responseFormatter } = require("./global/helper");
app.use(responseFormatter);

// start use routes
const authRoutes = require("./routes/AuthRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/UserRouters");
app.use("/api/users", userRoutes);

const productCategoryRoutes = require("./routes/ProuctCategoryRoutes");
app.use("/api/product-category", productCategoryRoutes);

const accountRoutes = require("./routes/AccountRoutes");
app.use("/api/settings/accounts", accountRoutes);

const supplierRoutes = require("./routes/SupplierRoutes");
app.use("/api/suppliers", supplierRoutes);

const productRoutes = require("./routes/ProductRoutes");
app.use("/api/products", productRoutes);
// end use routes

app.listen(port, console.log(`Server is running on port ${port}`));
