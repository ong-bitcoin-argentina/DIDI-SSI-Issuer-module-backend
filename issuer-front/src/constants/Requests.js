export const options = (token, method = "GET", data) => ({
	method,
	headers: {
		"Content-Type": "application/json",
		token
	},
	...(method !== "GET" && { body: JSON.stringify(data) })
});
