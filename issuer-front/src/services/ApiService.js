import Constants from "../constants/Constants";

export default class ApiService {
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
					const token = data.data.token;
					return cb(token);
				} else {
					errCb(data.data);
				}
			})
			.catch(err => errCb(err));
	}

	static createTemplate(token, name, cb, errCb) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				name: name,
				certData: "[]",
				participantData: "[]",
				othersData: "[]"
			})
		};

		fetch(Constants.API_ROUTES.CREATE_TEMPLATE, data)
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

	static getTemplates(token, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.GET_TEMPLATES, data)
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

	static getTemplate(token, id, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.GET_TEMPLATE(id), data)
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

	static toggleRequiredForTemplateField(token, id, dataElem, type, cb, errCb) {
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

		fetch(Constants.API_ROUTES.TOGGLE_REQUIRED_TEMPLATE_FIELD(id), data)
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

	static createTemplateField(token, id, dataElem, type, cb, errCb) {
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

		fetch(Constants.API_ROUTES.CREATE_TEMPLATE_FIELD(id), data)
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

	static setTemplateDefaultField(token, id, dataElem, defaultValue, type, cb, errCb) {
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

		fetch(Constants.API_ROUTES.SET_DEFAULT_TEMPLATE_FIELD(id), data)
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

	static deleteTemplate(token, id, cb, errCb) {
		const data = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.DELETE_TEMPLATE(id), data)
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

	static deleteTemplateField(token, id, dataElem, type, cb, errCb) {
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

		fetch(Constants.API_ROUTES.DELETE_TEMPLATE_FIELD(id), data)
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
