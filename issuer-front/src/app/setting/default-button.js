import { CircularProgress } from "@material-ui/core";
import React from "react";

const DefaultButton = ({ funct = () => {}, name, disabled, otherClass, loading, children, ...rest }) => (
	<button
		onClick={funct}
		className={`CreateButton ${disabled ? "CreateButtonDisabled" : otherClass}`}
		style={{ padding: "0 1em" }}
		disabled={disabled}
		{...rest}
	>
		{children}
		{loading ? <CircularProgress size={20} color="white" /> : <div className="CreateButtonText">{name}</div>}
	</button>
);

export default DefaultButton;
