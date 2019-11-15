import Constants from "../constants/Constants";

export default class CertificateService {
	static save(token, cert, cb, errCb) {
		const certData = {
			cert: cert.data.cert.map(data => {
				return {
					name: data.name,
					value: data.value
				};
			}),
			participant: cert.data.participant.map(data => {
				return {
					name: data.name,
					value: data.value
				};
			}),
			others: cert.data.others.map(data => {
				return {
					name: data.name,
					value: data.value
				};
			})
		};

		const method = cert._id ? "PUT" : "POST";
		const url = cert._id ? Constants.API_ROUTES.CERTIFICATES.EDIT(cert._id) : Constants.API_ROUTES.CERTIFICATES.CREATE;
		const data = {
			method: method,
			headers: {
				"Content-Type": "application/json",
				token: token
			},
			body: JSON.stringify({
				templateId: cert.templateId,
				data: JSON.stringify(certData)
			})
		};

		fetch(url, data)
			.then(data => {
				console.log(data);
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

	static emmit(token, id, cb, errCb) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		fetch(Constants.API_ROUTES.CERTIFICATES.EMMIT(id), data)
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

		fetch(Constants.API_ROUTES.CERTIFICATES.GET_ALL, data)
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

		fetch(Constants.API_ROUTES.CERTIFICATES.GET(id), data)
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

		fetch(Constants.API_ROUTES.CERTIFICATES.DELETE(id), data)
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
