const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// setting ups
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// trigger database connection
require('./models');

// start use routes
const authRoutes = require('./routes/AuthRoutes');
app.use('/api/auth', authRoutes);
// end use routes

app.listen(port, console.log(`Server is running on port ${port}`));
