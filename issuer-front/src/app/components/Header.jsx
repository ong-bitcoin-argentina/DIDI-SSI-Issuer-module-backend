import React, { useState } from "react";
import { Button, MenuItem, Menu } from "@material-ui/core";
import Cookie from "js-cookie";
import Messages from "../../constants/Messages";
import logoApp from "../../images/ai-di-logo.svg";
import Constants from "../../constants/Constants";
import { useHistory } from "react-router-dom";

const { RENAME_ISSUER, EXIT } = Messages.EDIT.BUTTONS;

const Header = ({ onRenameModalOpen }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const history = useHistory();
	const role = Cookie.get("role");

	const onMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const onMenuClose = event => {
		setAnchorEl(null);
	};

	const onLogout = () => {
		Cookie.set("token", "");
		Cookie.set("role", "");
		history.push(Constants.ROUTES.LOGIN);
	};

	return (
		<div className="Header">
			<img src={logoApp} alt="ai di logo" />
			<Button aria-controls="simple-menu" aria-haspopup="true" onClick={onMenuOpen} style={{ color: "white" }}>
				Menu
			</Button>
			<Menu id="simple-menu" keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
				{role === Constants.ROLES.Admin && <MenuItem onClick={onRenameModalOpen}>{RENAME_ISSUER}</MenuItem>}
				<MenuItem onClick={onLogout}>{EXIT}</MenuItem>
			</Menu>
		</div>
	);
};

export default Header;
