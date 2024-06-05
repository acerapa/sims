export const Helpers = {
	objectReset: (obj) => {
		const keys = Object.keys(obj);
		const newObj = {};
		keys.forEach(key => {
			newObj[key] = '';
		})

		return newObj;
	}
}