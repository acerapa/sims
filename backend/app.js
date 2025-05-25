const path = require("path");
const express = require("express");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");

const app = express();
const cors = require("cors");

const server = createServer(app);

// enable env config
require("dotenv").config();

const { initializeSocket } = require("./socket");
const io = initializeSocket(server);

const {
  startNotificationSocketNamespace,
} = require("./socket/namespaces/notification");

// notification socket
startNotificationSocketNamespace(io);

const port = process.env.PORT || 3001;

// setting ups
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// trigger database connection
require("./models");

// response formatter
const { responseFormatter } = require("./global/helper");
app.use(responseFormatter);

// api routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// forward request to frontend if no api route is matched
// THIS IS ACTUALLY EXPERIMENTAL AND ONLY USED IN DEV SERVER (RENDER) AS A WORKAROUND
app.use(express.static(path.join(path.dirname(__dirname), "/frontend/dist")));
app.use("*", (req, res) => {
  res.sendFile(
    path.join(path.dirname(__dirname), "/frontend/dist", "index.html")
  );
});

server.listen(port, console.log(`Server is running on port ${port}`));
