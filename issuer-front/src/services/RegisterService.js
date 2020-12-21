import Constants from "../constants/Constants";
import { fetchData, options, optionsBody } from "./utils";

const { DONE } = Constants.STATUS;
const { GET, GET_ALL_BLOCKCHAINS, CREATE } = Constants.API_ROUTES.REGISTER;
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

	static refresh(did) {
		return fetchData(options("POST"), `${CREATE}/${did}/refresh`);
	}
}
