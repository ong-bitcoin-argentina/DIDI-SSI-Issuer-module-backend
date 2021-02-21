import React from "react";

const BlockchainName = ({ did }) => {
	return did && <span style={{ textTransform: "uppercase", marginLeft: "5px" }}>({did.split(":")[2]})</span>;
};

export default BlockchainName;
