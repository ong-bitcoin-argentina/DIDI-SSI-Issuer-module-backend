import Constants from "../constants/Constants";

const { DONE } = Constants.STATUS;
export default class RegisterService {
	static async getAll(token, params = { status: DONE }) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		const url = new URL(Constants.API_ROUTES.REGISTER.GET);
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

		const response = await fetch(url, data);
		return response.json();
	}

	static async getAllBlockchains(token) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		const response = await fetch(Constants.API_ROUTES.REGISTER.GET_ALL_BLOCKCHAINS, data);
		return response.json();
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
				did: body.did,
				key: body.key
			})
		};

		return fetch(Constants.API_ROUTES.REGISTER.CREATE, data);
	}
}
