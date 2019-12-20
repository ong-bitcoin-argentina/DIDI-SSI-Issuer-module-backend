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

	static get(id, cb, errCb) {
		const data = {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		};

		fetch(Constants.API_ROUTES.PARTICIPANTS.GET(id), data)
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
