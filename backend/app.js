const express = require("express");
const { createServer } = require("http");
const { initializeSocket } = require("./socket");

const app = express();
const cors = require("cors");

const server = createServer(app);
initializeSocket(server);

const { startNotificationSocketNamespace } = require("./socket/notification");

// notification socket
startNotificationSocketNamespace();

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

// api routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

server.listen(port, console.log(`Server is running on port ${port}`));
