const { FULL_URL } = require("../../constants/Constants");

const sancorImgUrl = `${FULL_URL}/img/CredencialSancor.png`;

const defaultRows = [{ columns: 2 }, { columns: 1 }, { columns: 1 }, { columns: 1 }];

// Para agregar mas Cards Customizadas, seguir este formato
const sancorCard = {
	rows: defaultRows,
	backgroundImage: sancorImgUrl,
	style: "dark"
};

const cardLayouts = {
	"1": undefined,
	"2": undefined,
	"3": undefined,
	"4": sancorCard
};

function getCardLayout(previewType) {
	return cardLayouts[previewType] || null;
}

module.exports = {
	getCardLayout
};
