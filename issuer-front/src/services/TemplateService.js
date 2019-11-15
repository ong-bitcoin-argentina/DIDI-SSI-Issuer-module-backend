import Constants from "../constants/Constants";

export default class TemplateService {

	static create(token, name, cb, errCb) {
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

		fetch(Constants.API_ROUTES.TEMPLATES.CREATE, data)
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

	static getAll(token, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.TEMPLATES.GET_ALL, data)
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

	static get(token, id, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.TEMPLATES.GET(id), data)
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

	static toggleRequired(token, id, dataElem, type, cb, errCb) {
		const data = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				data: JSON.stringify([dataElem]),
				type: type
			})
		};

		fetch(Constants.API_ROUTES.TEMPLATES.TOGGLE_REQUIRED(id), data)
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

	static createField(token, id, dataElem, type, cb, errCb) {
		const data = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				data: JSON.stringify([dataElem]),
				type: type
			})
		};

		fetch(Constants.API_ROUTES.TEMPLATES.CREATE_FIELD(id), data)
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

	static setDefaultField(token, id, dataElem, defaultValue, type, cb, errCb) {
		const data = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				data: JSON.stringify([dataElem]),
				type: type,
				defaultValue: defaultValue
			})
		};

		fetch(Constants.API_ROUTES.TEMPLATES.SET_DEFAULT_FIELD(id), data)
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

	static delete(token, id, cb, errCb) {
		const data = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.TEMPLATES.DELETE(id), data)
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

	static deleteField(token, id, dataElem, type, cb, errCb) {
		const data = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				data: JSON.stringify([dataElem]),
				type: type
			})
		};

		fetch(Constants.API_ROUTES.TEMPLATES.DELETE_FIELD(id), data)
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
