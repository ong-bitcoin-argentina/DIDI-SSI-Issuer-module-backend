import Constants from "../constants/Constants";
import { fetchData, optionsBody } from "./utils";

export default class DelegateService {
	static getAll(token, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.DELEGATE.GET_ALL, data)
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

	static async getAllAsync(token) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		const response = await fetch(Constants.API_ROUTES.DELEGATE.GET_ALL, data);
		const json = await response.json();

		if (json.status === "success") return json.data;
		throw json.data;
	}

	static create(data) {
		return fetchData(optionsBody("POST", data), Constants.API_ROUTES.DELEGATE.CREATE);
	}

	static delete(token, did, cb, errCb) {
		const data = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				did: did
			})
		};

		fetch(Constants.API_ROUTES.DELEGATE.DELETE, data)
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

	static getIssuerName(token, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.DELEGATE.GET_NAME, data)
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

	static changeIssuerName(token, name, cb, errCb) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				name: name
			})
		};

		fetch(Constants.API_ROUTES.DELEGATE.CHANGE_NAME, data)
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
}
