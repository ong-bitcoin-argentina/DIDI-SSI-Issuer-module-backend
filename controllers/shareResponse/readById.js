const ResponseHandler = require("../../routes/utils/ResponseHandler");
const ShareResponseService = require("../../services/ShareResponseService");

const readById = async (req, res) => {
	try {
		const { id } = req.params;
		const shareResponse = await ShareResponseService.getById(id);
		return ResponseHandler.sendRes(res, shareResponse);
	} catch (err) {
		return ResponseHandler.sendErrWithStatus(res, err);
	}
};

module.exports = {
	readById
};
