import { Method, api } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
	const accessToken = ref('');
	const refreshToken = ref('');

	const persistTokens = () => {
		localStorage.setItem('tokens', JSON.stringify({
			access: accessToken.value,
			refresh: refreshToken.value
		}));
	}

	const setTokens = (access, refresh, isPersist = false) => {
		accessToken.value = access;
		refreshToken.value = refresh;

		if (isPersist) persistTokens();
	}

	const getTokens = () => {
		if (!accessToken.value && refreshToken.value) {
			if (localStorage.getItem('tokens')) {
				const tokens = JSON.parse(localStorage.getItem('tokens'));
				accessToken.value = tokens.access;
				refreshToken.value = tokens.refresh;
			}
		}

		return { access: accessToken.value, refresh: refreshToken.value };
	}

	const authenticate = async (credentials) => {
		const res = await api('auth/login', Method.POST, credentials);
		if (res.status == 200 && res.data) {
			setTokens(res.data.access, res.data.refresh, true);
		}
		return res;
	}

	return {
		accessToken,
		refreshToken,
		setTokens,
		getTokens,
		authenticate
	}
});
