const ResponseHandler = require("../../routes/utils/ResponseHandler");
const ShareResponseService = require("../../services/ShareResponseService");

const create = async (req, res) => {
	try {
		const { vc, req: request } = req.body;
		const { did } = req.params;
		// Guardar el modelo
		const shareResp = await ShareResponseService.create(vc, request);

		return ResponseHandler.sendRes(res, "ok");
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
		return ResponseHandler.sendErrWithStatus(res, err);
	}
};

module.exports = {
	create
};
