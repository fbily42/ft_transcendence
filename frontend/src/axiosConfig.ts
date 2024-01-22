// import axios from 'axios';

// // Créez une nouvelle instance axios
// const instance = axios.create({
// 	// Vous pouvez définir ici des paramètres globaux pour axios, comme l'URL de base de votre API
// });

// // Ajoutez un intercepteur de réponse à l'instance axios
// instance.interceptors.response.use(
// 	response => response,
// 	error => {
// 		console.log('je suis dans instance');
// 		const originalRequest = error.config;
// 		if (error.response.status === 403 && !originalRequest._retry) {
// 			originalRequest._retry = true;
// 			console.log('je suis dans instance 1 ');
// 			// Assurez-vous de remplacer /refresh_token par l'URL de votre endpoint de rafraîchissement de token
// 			return instance.get('http://localhost:3333/refresh-token', { withCredentials: true })
// 				.then(response => {
// 						// Assurez-vous de mettre à jour le token d'authentification dans votre application ici
// 						return instance(originalRequest);
// 				})
// 		}
// 		return Promise.reject(error);
// 	}
// );

// // Exportez l'instance axios
// export default instance;
import axios from 'axios';

const instance = axios.create({
    // Configuration de base
	withCredentials: true,
});

instance.interceptors.response.use(
    response => response,
    async error => {
        if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
            try {
				console.log('je suis intercepte');
                // URL de la nouvelle API à appeler en cas d'erreur 403
                // const urlNouvelleAPI = 'http://localhost:3333/refresh-token';

                // Vous pouvez ajouter ici des paramètres supplémentaires si nécessaire
                // const nouvelleResponse = await axios.get('http://localhost:3333/refresh-token', {withCredentials : true });
				const Newresponse = await axios.get("http://localhost:3333/auth/refresh-token", {
					withCredentials: true,
			});
                return Newresponse;
            } catch (nouvelleErreur) {
                // Gérer ou transmettre les erreurs du nouvel appel Axios
                return Promise.reject(nouvelleErreur);
            }
        }

        // Pour toutes les autres erreurs, rejeter la promesse
        return Promise.reject(error);
    }
);

export default instance;
