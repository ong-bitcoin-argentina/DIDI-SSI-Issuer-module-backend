import MaterialIconsReact from "material-icons-react";
import React from "react";
import Constants from "../../constants/Constants";

const OpenModalButton = ({ setModalOpen, title }) => (
	<button className="CreateButton" onClick={() => setModalOpen(true)}>
		<MaterialIconsReact icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
		<div className="CreateButtonText">{title}</div>
	</button>
);

export default OpenModalButton;
