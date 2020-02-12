const Constants = require("../../constants/Constants");

class ResponseHandler {

	// mandar respuesta html generica
	static sendHtml(res, data) {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		if (Constants.DEBUGG) console.log(data);
		res.write(data);
		return res.end();
	}

	// mandar respuesta exitosa generica
	static sendRes(res, data) {
		res.type("application/json");

		if (Constants.DEBUGG)
			console.log({
				status: "success",
				data: data
			});
		return res.json({
			status: "success",
			data: data
		});
	}

	// mandar respuesta de error generica
	static sendErr(res, err) {
		if (Constants.DEBUGG)
			console.log({
				status: "error",
				data: err
			});
		return res.json({
			status: "error",
			data: err
		});
	}
}

module.exports = ResponseHandler;
