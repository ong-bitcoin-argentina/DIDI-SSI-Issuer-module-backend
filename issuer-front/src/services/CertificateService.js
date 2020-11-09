import Constants from "../constants/Constants";
import { options } from "../constants/Requests";
const { GET_ALL, GET_EMMITED, GET_PENDING, GET_REVOKED, DELETE } = Constants.API_ROUTES.CERTIFICATES;

export default class CertificateService {
	static save(token, cert, cb, errCb) {
		const certData = {
			cert: cert.data.cert.map(data => {
				return {
					name: data.name,
					value: data.value
				};
			}),
			participant: cert.data.participant.map(array => {
				return array.map(data => {
					return {
						name: data.name,
						value: data.value
					};
				});
			}),
			others: cert.data.others.map(data => {
				return {
					name: data.name,
					value: data.value
				};
			})
		};

		const microCredsData = cert.microCredentials
			? cert.microCredentials
			: [
					{
						title: "certificate data",
						names: cert.data.cert.map(data => data.name)
					},
					{
						title: "participant data",
						names: cert.data.participant[0].map(data => data.name)
					},
					{
						title: "others data",
						names: cert.data.others.map(data => data.name)
					}
			  ];

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
				data: JSON.stringify(certData),
				split: cert.split,
				microCredentials: microCredsData
			})
		};

		fetch(url, data)
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

		fetch(GET_ALL, data)
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

	static async getEmmited(token) {
		let result = await fetch(GET_EMMITED, options(token));
		result = await result.json();
		if (result.status === "success") {
			return result.data;
		}
		throw result;
	}

	static async getPending(token) {
		let result = await fetch(GET_PENDING, options(token));
		result = await result.json();
		if (result.status === "success") {
			return result.data;
		}
		throw result;
	}

	static async getRevoked(token) {
		// TODO: change pending for revoked endpoint
		let result = await fetch(GET_REVOKED, options(token));
		result = await result.json();
		if (result.status === "success") {
			return result.data;
		}
		throw result;
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

	static delete(token, id) {
		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				token: token
			}
		};

		return fetch(DELETE(id), options);
	}

	static revoke(token, id, reason) {
		return fetch(DELETE(id), options(token, "DELETE", { reason }));
	}
}
