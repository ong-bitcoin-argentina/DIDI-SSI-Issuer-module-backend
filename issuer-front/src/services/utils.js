import moment from "moment";

export const filter = (item, key, val) => {
	const parsedVal = val && val.toLowerCase();
	return !parsedVal || item[key]?.toLowerCase().includes(parsedVal);
};

export const filterByDates = (item, from, to, key) => {
	const key_ = key ? item[key] : item.createdOn;
	const target = moment(key_);
	return !from || !to || (from.isSameOrBefore(target, "day") && to.isSameOrAfter(target, "day"));
};

export const options = method => token => ({
	method: method,
	headers: {
		"Content-Type": "application/json",
		token: token
	}
});

export const optionsBody = (method, body) => token => ({
	...options(method)(token),
	body: JSON.stringify(body)
});

export const fetchData = (optionsF, url) => async token => {
	const response = await fetch(url, optionsF(token));

	const json = await response.json();

	if (json.status === "success") return json.data;
	throw json.data;
};
