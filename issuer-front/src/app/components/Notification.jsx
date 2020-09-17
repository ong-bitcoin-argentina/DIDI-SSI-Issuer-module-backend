import React from "react";
import { Snackbar, Slide } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function SlideTransition(props) {
	return <Slide {...props} direction="left" />;
}

const Notification = ({ open, message, onClose, time = 2500, severity = "success" }) => {
	return (
		<Snackbar
			open={open}
			TransitionComponent={SlideTransition}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			autoHideDuration={time}
			onClose={onClose}
		>
			<Alert elevation={6} variant="filled" severity={severity}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
