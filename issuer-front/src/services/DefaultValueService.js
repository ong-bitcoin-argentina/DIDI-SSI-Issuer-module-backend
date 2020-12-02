import Constants from "../constants/Constants";

export default class DefautValueService {
	static async create(token, body) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify(body)
		};
		const response = await fetch(Constants.API_ROUTES.DEFAULT_VALUE, data);
		return await response.json();
	}

	static async edit(token, body) {
		const data = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify(body)
		};
		const response = await fetch(Constants.API_ROUTES.DEFAULT_VALUE, data);
		return await response.json();
	}

	static async get(token) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		const response = await fetch(Constants.API_ROUTES.DEFAULT_VALUE, data);
		return response.json();
	}
}
