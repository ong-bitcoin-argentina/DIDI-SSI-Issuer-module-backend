import { Grid } from "@material-ui/core";
import React from "react";
import { TAB_TEXT } from "../../constants/Messages";

const TabDescription = ({ tabName }) => {
	return (
		<Grid container xs={12} style={{ margin: "10px 0" }}>
			<Grid item xs={8} container direction="column" style={{ textAlign: "start" }}>
				<h1 style={{ margin: "0", padding: "0" }}>{TAB_TEXT[tabName].TITLE}</h1>
				<p>{TAB_TEXT[tabName].DESCRIPTION}</p>
			</Grid>
		</Grid>
	);
};

export default TabDescription;
