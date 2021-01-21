import React, { useState } from "react";
import { Collapse, Grid, Typography } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import Constants from "../../../constants/Constants";
import "./_style.scss";

const { ERROR, ERROR_RENEW } = Constants.STATUS;

const MESSAGES = {
	[ERROR]: blockchain => `Ocurrió un error al registrar el DID de emisor en la Blockchain ${blockchain}. Por favor, volvé a reintentar la
        operación desde el menú de acciones, con el siguiente botón `,
	[ERROR_RENEW]: blockchain => `Ocurrió un error al renovar el DID de emisor en la Blockchain ${blockchain}. Por favor, volvé a reintentar la
  operación desde el botón RENOVAR`
};

const CollapseMessageError = ({ blockchain, messageError, status }) => {
	const [open, setOpen] = useState(false);

	const icons = {
		[ERROR]: <RefreshIcon className="refresh-icon" />
	};

	return (
		<>
			<Typography variant="subtitle2" className="message">
				{MESSAGES[status](blockchain)}
				{icons[status]}.
			</Typography>
			<Grid container justify="flex-end">
				<span onClick={() => setOpen(v => !v)} className="error-detail">
					Ver detalle del error.
				</span>
			</Grid>
			<Collapse in={open} timeout="auto" unmountOnExit style={{ marginTop: "20px" }}>
				<Typography variant="body2" className="message-error-collapse">
					{messageError}
				</Typography>
			</Collapse>
		</>
	);
};

export default CollapseMessageError;
