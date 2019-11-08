
class ResponseHandler {
	static sendHtml (res, data) {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		res.write(data);
		return res.end();
	};
	
	static sendRes (res, data) {
		res.type("application/json");
		return res.json({
			status: "success",
			data: data
		});
	};
	
	static sendErr (res, err) {
		return res.json({
			status: "error",
			data: err
		});
	};
}

module.exports = ResponseHandler;