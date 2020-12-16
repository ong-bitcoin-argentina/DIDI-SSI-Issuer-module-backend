import Constants from "../constants/Constants";

const { DONE } = Constants.STATUS;
const { GET, GET_ALL_BLOCKCHAINS, CREATE } = Constants.API_ROUTES.REGISTER;

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

const fetchData = (optionsF, url = GET) => async token => {
	const response = await fetch(url, optionsF(token));

	const json = await response.json();

	if (json.status === "success") return json.data;
	throw json.data;
};
export default class RegisterService {
	static getAll(params = { status: DONE }) {
		const url = new URL(GET);
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

		return fetchData(options("GET"), url);
	}

	static getAllBlockchains() {
		return fetchData(options("GET"), GET_ALL_BLOCKCHAINS);
	}

	static create({ name, did, key }) {
		return fetchData(optionsBody("POST", { name, did, key }), CREATE);
	}

	static editName(did, name) {
		return fetchData(optionsBody("POST", { name }), `${CREATE}/${did}`);
	}

	static retry(did) {
		return fetchData(options("POST"), `${CREATE}/${did}/retry`);
	}
}
