import { Button } from "@material-ui/core";
import React from "react";

const DefaultButton = ({ funct, name, templateLoading, registerLoading }) => (
	<Button
		type="ṕrimary"
		onClick={funct}
		variant="contained"
		color="primary"
		style={{ background: "#256EE0", color: "#fff" }}
		disabled={templateLoading || registerLoading}
	>
		{name}
	</Button>
);

export default DefaultButton;
