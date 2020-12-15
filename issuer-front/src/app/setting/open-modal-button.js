import { Button } from "@material-ui/core";
import React from "react";

const OpenModalButton = ({ setModalOpen, title }) => (
	<Button
		variant="contained"
		color="primary"
		style={{ background: "#256EE0", color: "#fff" }}
		onClick={() => setModalOpen(true)}
	>
		{title}
	</Button>
);

export default OpenModalButton;
