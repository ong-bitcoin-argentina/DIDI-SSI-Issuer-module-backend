import React from "react";
import { Button } from "@material-ui/core";
import Cookie from "js-cookie";
import Messages from "../../constants/Messages";
import logoApp from "../../images/ai-di-logo.svg";
import Constants from "../../constants/Constants";
import { useHistory } from "react-router-dom";

const { EXIT } = Messages.EDIT.BUTTONS;

const Header = ({ onRenameModalOpen, resetTab }) => {
	const history = useHistory();

	const onLogout = () => {
		Cookie.set("token", "");
		Cookie.set("roles", []);
		history.push(Constants.ROUTES.LOGIN);
	};

	const goToHome = () => {
		if (resetTab) resetTab();
		history.push(Constants.ROUTES.LIST);
	};

	return (
		<div className="Header">
			<img src={logoApp} alt="ai di logo" onClick={goToHome} style={{ cursor: "pointer" }} />
			<Button aria-controls="simple-menu" aria-haspopup="true" onClick={onLogout} style={{ color: "white" }}>
				{EXIT}
			</Button>
		</div>
	);
};

export default Header;
