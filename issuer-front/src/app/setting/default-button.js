import { CircularProgress } from "@material-ui/core";
import React from "react";

const DefaultButton = ({ funct = () => {}, name, disabled, otherClass, loading, ...rest }) => (
	<button
		onClick={funct}
		className={`CreateButton ${disabled ? "CreateButtonDisabled" : otherClass}`}
		style={{ padding: "0 1em" }}
		disabled={disabled}
		{...rest}
	>
		{loading ? <CircularProgress size={20} color="white" /> : <div className="CreateButtonText">{name}</div>}
	</button>
);

export default DefaultButton;
