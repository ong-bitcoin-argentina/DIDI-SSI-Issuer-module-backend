import Constants from "../constants/Constants";

export default class UserService {
	static login(user, pass, cb, errCb) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name: user,
				password: pass
			})
		};

		fetch(Constants.API_ROUTES.LOGIN, data)
			.then(data => {
				return data.json();
			})
			.then(data => {
				if (data.status === "success") {
					return cb(data.data);
				} else {
					errCb(data.data);
				}
			})
			.catch(err => errCb(err));
	}

	static getAll(token) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		return fetch(Constants.API_ROUTES.USER.GET_ALL, data);
	}

	static create(token, body) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				name: body.name,
				type: body.type,
				password: body.password
			})
		};

		return fetch(Constants.API_ROUTES.USER.CREATE, data);
	}

	static delete(token, id) {
		const data = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		return fetch(Constants.API_ROUTES.USER.DELETE(id), data);
	}
}
