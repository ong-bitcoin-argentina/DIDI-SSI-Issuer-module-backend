import React, { useState, useEffect } from "react";
import { Snackbar, Slide } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function SlideTransition(props) {
	return <Slide {...props} direction="left" />;
}

const Notification = ({ open, message, time = 2000, severity = "success" }) => {
	const [view, setView] = useState(open);

	useEffect(() => {
		setView(open);
	}, [open]);

	useEffect(() => {
		if (view) {
			setTimeout(() => {
				setView(false);
			}, time);
		}
	}, [view]);

	return (
		<Snackbar open={view} TransitionComponent={SlideTransition} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
			<Alert elevation={6} variant="filled" severity={severity}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
