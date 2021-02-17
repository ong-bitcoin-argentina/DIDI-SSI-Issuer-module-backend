import { Grid, IconButton } from "@material-ui/core";
import React, { useRef, useState } from "react";
import Notification from "./Notification";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const NOTIFICATION_TEXT = "Copiado con éxito";

const ClipBoardInput = ({ label, value, handleChange, name, type }) => {
	const [openNotification, setOpenNotification] = useState(false);
	const [defaultType, setDefaultType] = useState(type);
	const [visibilyPassword, setVisibilyPassword] = useState(false);
	const myInput = useRef(null);

	const copy = () => {
		myInput.current.select();
		document.execCommand("copy");
		setOpenNotification(true);
	};

	const onCloseNotification = (e, reason) => {
		if (reason !== "clickaway") {
			setOpenNotification(false);
		}
	};

	const handleShowPassword = () => {
		setVisibilyPassword(prev => !prev);
		setDefaultType(val => (val === "password" ? "text" : "password"));
	};

	const PasswordIcon = () => (
		<IconButton aria-label="copy" onClick={handleShowPassword}>
			{visibilyPassword ? (
				<VisibilityOffIcon style={{ transform: "scale(0.9)" }} />
			) : (
				<VisibilityIcon style={{ transform: "scale(0.9)" }} />
			)}
		</IconButton>
	);

	const PasswordButton = () => {
		return (
			<>
				{visibilyPassword && (
					<IconButton aria-label="copy" onClick={copy}>
						<FileCopyOutlinedIcon style={{ transform: "scale(0.9)" }} />
					</IconButton>
				)}
				<PasswordIcon />
			</>
		);
	};
	return (
		<Grid style={{ margin: "15px 0" }}>
			<span style={{ color: "#00000061" }}>{label}:</span>
			<Grid container item xs={12} direction="row" alignItems="center">
				<Grid item xs={9}>
					<input
						required
						name={name}
						defaultValue={value}
						onChange={handleChange}
						ref={myInput}
						type={defaultType}
						style={{ width: "100%", height: "25px", border: "1px solid #949494" }}
					/>
				</Grid>
				<Grid item xs={3} container justify="flex-start" style={{ paddingLeft: "10px" }}>
					{type === "password" ? (
						<PasswordButton />
					) : (
						<IconButton aria-label="copy" onClick={copy}>
							<FileCopyOutlinedIcon style={{ transform: "scale(0.9)" }} />
						</IconButton>
					)}
				</Grid>
			</Grid>
			<Notification open={openNotification} message={NOTIFICATION_TEXT} onClose={onCloseNotification} />
		</Grid>
	);
};

export default ClipBoardInput;
