const express = require('express');
const app = express();
const cors = require('cors');

// enable env config
require('dotenv').config();

const port = process.env.PORT || 3000;

// setting ups
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// trigger database connection
require('./models');

// start use routes
const authRoutes = require('./routes/AuthRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/UserRouters');
app.use('/api/users', userRoutes);

const productCategoryRoutes = require('./routes/ProuctCategoryRoutes');
const { migrator } = require('./global/helper');
app.use('/api/product-category', productCategoryRoutes);
// end use route

// migration
app.get('/', async (req, res) => {
	const rs = await migrator();
	res.status(200).json(rs);
});

app.listen(port, console.log(`Server is running on port ${port}`));
