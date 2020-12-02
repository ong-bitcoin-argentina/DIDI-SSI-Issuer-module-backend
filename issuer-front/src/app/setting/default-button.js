import { Button } from "@material-ui/core";
import React from "react";

const DefaultButton = ({ funct, name, templateLoading, registerLoading }) => (
	<Button
		type="ṕrimary"
		onClick={funct}
		variant="contained"
		color="primary"
		disabled={templateLoading || registerLoading}
	>
		{name}
	</Button>
);

export default DefaultButton;
