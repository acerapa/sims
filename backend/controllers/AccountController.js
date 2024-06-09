const Account = require('../models/account');
const AccountSchema = require('../validator/Settings');

module.exports = {
	all: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		};

		try {
			const accounts = await Account.findAll({
				order: [
					['createdAt', 'DESC']
				]
			});
			response.message = 'Successfully fetched!';
			response.status = 200;
			response.data = { accounts };
		} catch (e) {
			response.message += e.message;
			response.data = e;
		}

		res.status(response.status).json(response);
	},

	register: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong!',
			status: 400,
			data: {}
		};

		const { error } = AccountSchema.validate(req.body);
		
		if (!error) {
			try {
				await Account.create(req.body);
				response.message = 'Successfully Created!';
				response.status = 200; 
			} catch (e) {
				response.message += e.message;
				response.data = e;
			}
		} else {
			response.data = error;
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
			await Account.update(
        {
          name: req.body.name,
          type: req.body.type,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );

			response.message = 'Successfully updated!';
			response.status = 200;
		} catch (e) {
			response.message += e.message;
			response.data = e;
		}

		return res.status(response.status).json(response);
	},

	delete: async (req, res) => {
		const response = {
			message: 'Something wen\'t wrong',
			status: 400,
			data: {} 
		}

		try {
			await Account.destroy({where: {
				id: req.body.id
			}});
			response.message = 'Seccessfully deleted!';
			response.status = 200;
		} catch (e) {
			response.message += e.message;
			response.data = e;
		}

		return res.status(response.status).json(response);
	}
}