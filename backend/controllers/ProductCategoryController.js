const ProductCategory = require('../models/product-category');

module.exports = {
	all: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		}

		try {
			const categories = await ProductCategory.findAll({
				order: [['createdAt', 'DESC']]
			});
			response.message = 'Successfully fetched!';
			response.status = 200;
			response.data = { categories };
		} catch (e) {
			response.message += e.message;
		}

		res.status(response.status).json(response);
	},

	register: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		};

		try {
			const productCategory = await ProductCategory.create(req.body);
			response.message = 'Successfully Created!';
			response.status = 200;
			response.data = productCategory;
		} catch (e) {
			response.message += e.message;
		}

		res.status(response.status).json(response);
	},

	update: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		};

		try {
			await ProductCategory.update({ name: req.body.name }, { where: { id: req.body.id } });
			response.message = 'Successfully updated!';
			response.status = 200;
		} catch (e) {
			response.message += e.message;
		}

		res.status(response.status).json(response);
	},

	delete: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		};

		try {
			await ProductCategory.destroy({ where: { id: req.body.id } });
			response.message = 'Successfully Deleted!';
			response.status = 200;
		} catch (e) {
			response.message += e.message;
		}

		res.status(response.status).json(response);
	}
}