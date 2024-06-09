const apiConfig = {
	serverUrls: {
		development: import.meta.env.VITE_DEV_SERVER,
		production: import.meta.VITE_PROD_SERVER,
		test: import.meta.VITE_TEST_SERVER
	},
	defaultHeaders: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
}
console.log(apiConfig, import.meta.env.MODE, import.meta.env.VITE_SAMPLE_API);
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

	const response = await fetch(request);

	const contentType = response.headers.get('Content-Type');
	let responseData;

	if (contentType) {
		if (contentType.includes('application/json')) {
			responseData = await response.json();
		} else if (contentType.includes('text/')) {
			responseData = await response.text();
		} else if (contentType.includes('image/') || contentType.includes('audio/') || contentType.includes('video/') || contentType.includes('application/octet-stream')) {
			responseData = await response.blob();
		} else {
			responseData = await response.text(); // Fallback for other content types
		}
	}

	return responseData;
}

export const authenticatedApi = async (url, method = Method.GET, payload = null, hdrs = {}) => {
	const verifyToken = await verifyAccessToken();
	if (!verifyToken) {
		await getRefreshToken();
	}

	const token = getTokens().access;

	hdrs = { ...hdrs, Authorization: `Bearer ${token}` };
	return await api(url, method, payload, hdrs);
}

// Private functions
const verifyAccessToken = async () => {
	const tokens = getTokens();
	let isValid = false;
	if (Object.keys(tokens).length) {
		const res = await api('auth/token/verify', Method.POST, { token: tokens.access });
		if (res.status == 200 && res.data) isValid = res.data.isValid;
	}

	return isValid;
}

const getRefreshToken = async () => {
	const res = await api('auth/token/refresh', Method.POST, { refresh: getTokens().refresh });
	if (res.status = 200 && res.data) {
		// manually set tokens to localstorage
		localStorage.setItem('tokens', JSON.stringify({
			access: res.data.access,
			refresh: res.data.refresh
		}));
	}

	return res;
}


const getTokens = () => {
	const strTokens = localStorage.getItem('tokens');
	let token = {};
	if (strTokens) {
		token = JSON.parse(strTokens);
	}

	return token;
}
