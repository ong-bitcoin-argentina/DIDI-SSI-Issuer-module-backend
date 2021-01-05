import { Grid, IconButton } from "@material-ui/core";
import React, { useRef, useState } from "react";
import Notification from "./Notification";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

const NOTIFICATION_TEXT = " fue copiado/a con éxito.";

const ClipBoardInput = ({ label, value }) => {
	const [openNotification, setOpenNotification] = useState(false);
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

	return (
		<Grid style={{ margin: "15px 0" }}>
			<span style={{ color: "#00000061" }}>{label}:</span>
			<Grid container item xs={12} direction="row" alignItems="center">
				<Grid item xs={10}>
					<input
						readOnly
						value={value}
						ref={myInput}
						style={{ width: "100%", height: "25px", border: "1px solid #949494" }}
					/>
				</Grid>
				<Grid item xs={2} container justify="flex-end">
					<IconButton aria-label="copy" onClick={copy}>
						<FileCopyOutlinedIcon style={{ transform: "scale(0.9)" }} />
					</IconButton>
				</Grid>
			</Grid>
			<Notification open={openNotification} message={`${label} ${NOTIFICATION_TEXT}`} onClose={onCloseNotification} />
		</Grid>
	);
};

export default ClipBoardInput;
