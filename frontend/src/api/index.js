const token = '';

const apiConfig = {
	serverUrls: {
		development: import.meta.env.VITE_DEV_SERVER,
		production: import.meta.VITE_PROD_SERVER,
		test: import.meta.VITE_TEST_SERVER
	},
	defaultHeaders: {
		'Content-Type': 'appication/json',
		Accept: 'application/json'
	}
}

const BASE_PATH = apiConfig.serverUrls[import.meta.env.MODE];

export const Method = Object.freeze({
	GET: 'GET',
	PUT: 'PUT',
	POST: 'POST',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
});

export const api = async (url, method = Method.GET, payload = null, hdrs = {}) => {
	const headers = { ...apiConfig.defaultHeaders, ...hdrs };
	const requestInit = { method, headers };

	// if method is GET no need for body
	if (method != Method.GET) {
		requestInit.body = JSON.stringify(payload ? payload : {});
	}

	const request = new Request(`${BASE_PATH}${url}`, requestInit);

	const response = await (await fetch(request));
	console.log(response.headers.get('Content-Type'));
}

export const authenticatedApi = async (url, method = Method.GET, payload = null, hdrs = {}) => {
	hdrs = { ...hrds, Authorization: `Bearer ${token}` };
	console.log(await api(url, method, payload, hdrs));
}
