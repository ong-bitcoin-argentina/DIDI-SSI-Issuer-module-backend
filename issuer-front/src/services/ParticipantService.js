import Constants from "../constants/Constants";

export default class ParticipantsService {
	static getAll(templateId, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(Constants.API_ROUTES.PARTICIPANTS.GET_ALL(templateId), data)
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

	static createNew(partData, cb, errCb) {
		const data = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				data: partData
			})
		};

		fetch(Constants.API_ROUTES.PARTICIPANTS.POST_NEW, data)
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

	static getNew(code, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(Constants.API_ROUTES.PARTICIPANTS.GET_NEW(code), data)
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

	static get(did, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(Constants.API_ROUTES.PARTICIPANTS.GET(did), data)
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

	static getAllDids(cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(Constants.API_ROUTES.PARTICIPANTS.GET_DIDS, data)
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
