import { Grid } from "@material-ui/core";
import React from "react";
import { TAB_TEXT } from "../../../constants/Messages";
import "./_style.scss";

const TabDescription = ({ tabName }) => {
	return (
		<Grid container xs={12} direction="column" className="tab-description">
			<h1 className="m-0 p-0">{TAB_TEXT[tabName].TITLE}</h1>
			<p>{TAB_TEXT[tabName].DESCRIPTION}</p>
		</Grid>
	);
};

export default TabDescription;
