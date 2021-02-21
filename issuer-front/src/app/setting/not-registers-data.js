import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import OpenModalButton from "./open-modal-button";

const NotRegistersData = ({ setModalOpen }) => (
	<Grid container justify="center" style={{ padding: "40px" }}>
		<Grid item xs={12} container justify="center" style={{ margin: "20px 0 40px 0" }}>
			<WarningRoundedIcon style={{ color: "#ffd124", transform: "scale(3.5)" }} />
		</Grid>
		<Typography variant="h6">Es necesario que te registres en al menos una Blockchain para poder operar</Typography>
		<Grid item xs={12} container justify="center" style={{ margin: "20px 0 20px 0" }}>
			<OpenModalButton setModalOpen={setModalOpen} title="Nuevo Registro" />
		</Grid>
	</Grid>
);

export default NotRegistersData;
