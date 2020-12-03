import { Button } from "@material-ui/core";
import React from "react";

const OpenModalButton = ({ setModalOpen }) => (
	<Button
		variant="contained"
		color="primary"
		style={{ background: "#256EE0", color: "#fff" }}
		onClick={() => setModalOpen(true)}
	>
		Nuevo Registro
	</Button>
);

export default OpenModalButton;
