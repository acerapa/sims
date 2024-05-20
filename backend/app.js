const express = require('express');
const app = express();
const  { sequelize } = require('./models/index');
const port = process.env.PORT || 3000;


// test connection
try {
    sequelize.authenticate();
    console.log('Database is connected!');

    // start server
    app.listen(port, console.log(`Server is running on port ${port}`));
} catch (e) {
    console.error('Unable to connect to database', e);
}