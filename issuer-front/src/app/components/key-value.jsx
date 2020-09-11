import React from "react";
import { Typography } from "@material-ui/core";

const KeyValue = ({ field, value }) => {
	return (
		<Typography variant="subtitle2">
			<strong>{field}:</strong> {value}
		</Typography>
	);
};

export default KeyValue;
