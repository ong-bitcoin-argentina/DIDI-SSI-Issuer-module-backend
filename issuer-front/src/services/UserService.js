import Constants from "../constants/Constants";
import { fetchData, options, optionsBody } from "./utils";

const { CREATE, GET_ALL } = Constants.API_ROUTES.USER;
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

	static getAll() {
		return fetchData(options("GET"), GET_ALL);
	}

	static create(body) {
		return fetchData(optionsBody("POST", body), CREATE);
	}

	static edit(body) {
		return fetchData(optionsBody("PUT", body), Constants.API_ROUTES.USER.EDIT(body._id));
	}

	static delete(id) {
		return fetchData(options("DELETE"), Constants.API_ROUTES.USER.DELETE(id));
	}
}
