import axios from 'axios';

// Créez une nouvelle instance axios
const instance = axios.create({
	// Vous pouvez définir ici des paramètres globaux pour axios, comme l'URL de base de votre API
});

// Ajoutez un intercepteur de réponse à l'instance axios
instance.interceptors.response.use(
	response => response,
	error => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			// Assurez-vous de remplacer /refresh_token par l'URL de votre endpoint de rafraîchissement de token
			return instance.put('http://localhost:3333/refresh-token', null, { withCredentials: true })
				.then(response => {
					if (response.status === 201) {
						// Assurez-vous de mettre à jour le token d'authentification dans votre application ici
						return instance(originalRequest);
					}
				})
		}
		return Promise.reject(error);
	}
);

// Exportez l'instance axios
export default instance;
