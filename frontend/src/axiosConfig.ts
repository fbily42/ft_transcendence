import axios, {AxiosResponse} from 'axios';

let isRefreshing = false;
let failedQueue: { resolve: Function, reject: Function }[] = [];

const processQueue = (error: Error | null , tokenRefreshResponse: AxiosResponse| null = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(tokenRefreshResponse);
		}
	});

	failedQueue = [];
};

const instance = axios.create({
		withCredentials: true,
});

instance.interceptors.response.use(
	response => response,
	async error => {
		if (error.response && error.response.status === 403) {
			const originalRequest = error.config;
			if (!isRefreshing) {
				isRefreshing = true;
				axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`, {}, {withCredentials: true})
					.then(response => {
						isRefreshing = false;
						processQueue(null, response);
					})
					.catch(e => {
						isRefreshing = false;
						processQueue(e, null);
					});
			}

			return new Promise((resolve, reject) => {
				failedQueue.push({resolve, reject});
			}).then(() => { 
				return instance(originalRequest);
			}).catch(() => {
				return Promise.reject(error);
			  });
		}

		return Promise.reject(error);
	}
);

export default instance;