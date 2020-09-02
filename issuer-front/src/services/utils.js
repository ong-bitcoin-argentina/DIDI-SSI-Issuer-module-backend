import moment from "moment";

export const filter = (item, key, val) => {
	const parsedVal = val && val.toLowerCase();
	return !parsedVal || item[key].toLowerCase().includes(parsedVal);
};

export const filterByDates = (item, from, to) => {
	const target = moment(item.createdOn);
	return !from || !to || (from.isBefore(target) && to.isAfter(target));
};
