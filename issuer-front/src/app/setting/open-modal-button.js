import { Button } from "@material-ui/core";
import React from "react";

const OpenModalButton = ({ setModalOpen }) => (
	<Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
		Nuevo Registro
	</Button>
);

export default OpenModalButton;
