import Constants from "../constants/Constants";
import { fetchData, options, optionsBody } from "./utils";

const { PROFILE } = Constants.API_ROUTES;
export default class ProfileService {
	static getAll() {
		return fetchData(options("GET"), PROFILE);
	}

	static edit(id, profile) {
		return fetchData(optionsBody("PUT", profile), `${PROFILE}/${id}`);
	}

	static create(profile) {
		return fetchData(optionsBody("POST", profile), PROFILE);
	}

	static delete(id) {
		return fetchData(options("DELETE"), `${PROFILE}/${id}`);
	}
}
