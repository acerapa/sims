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
app.use('/api/product-category', productCategoryRoutes);
// end use route

// migration
const { migrator } = require('./global/helper');
app.get('/', async (req, res) => {
	const response = {
		message: "Something wen't wrong!",
		status: 400,
		data: {}
	}

	try {
		const rs = await migrator();
		response.status = 200;
		response.message = "Successfully migrated!!!";
		response.data = rs;
	} catch (e) {
		response.data = e;
	}
	res.status(response.status).json(response);
});

app.listen(port, console.log(`Server is running on port ${port}`));
