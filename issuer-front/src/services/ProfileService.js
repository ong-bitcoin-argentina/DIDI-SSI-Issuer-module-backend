import Constants from "../constants/Constants";

const { PROFILE } = Constants.API_ROUTES;

const options = method => token => ({
	method: method,
	headers: {
		"Content-Type": "application/json",
		token: token
	}
});

const optionsBody = (method, body) => token => ({
	...options(method)(token),
	body: JSON.stringify(body)
});

const fetchData = (optionsF, url = PROFILE) => async token => {
	const response = await fetch(url, optionsF(token));

	const json = await response.json();

	if (json.status === "success") return json.data;
	throw json.data;
};

export default class ProfileService {
	static getAll() {
		return fetchData(options("GET"));
	}

	static edit(id, profile) {
		return fetchData(optionsBody("PUT", profile), `${PROFILE}/${id}`);
	}

	static create(profile) {
		return fetchData(optionsBody("POST", profile));
	}

	static delete(id) {
		return fetchData(options("DELETE"), `${PROFILE}/${id}`);
	}
}
