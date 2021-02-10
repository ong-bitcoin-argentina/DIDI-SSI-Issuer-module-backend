import { Grid } from "@material-ui/core";
import React from "react";

const DescriptionGrid = ({ children: button, title, description }) => {
	return (
		<Grid container xs={12} style={{ margin: "10px 0" }}>
			<Grid item xs={8} container direction="column" style={{ textAlign: "start" }}>
				<h1 style={{ margin: "0", padding: "0" }}>{title}</h1>
				<p>{description}</p>
			</Grid>
			<Grid item xs={4} container justify="flex-end" alignItems="center">
				{button}
			</Grid>
		</Grid>
	);
};

export default DescriptionGrid;
