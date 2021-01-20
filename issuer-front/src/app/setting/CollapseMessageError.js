import { Collapse, Grid, Typography } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { useState } from "react";
import Constants from "../../constants/Constants";

const { ERROR, ERROR_RENEW } = Constants.STATUS;

const Icon = () => (
	<RefreshIcon style={{ transform: "scale(0.8)", margin: "-3px", position: "relative", bottom: "-3px" }} />
);

const CollapseMessageError = ({ blockchain, messageError, status }) => {
	const [open, setOpen] = useState(false);

	const messages = {
		[ERROR]: `Ocurrió un error al registrar el DID de emisor en la Blockchain ${blockchain}. Por favor, volvé a reintentar la
          operación desde el menú de acciones, con el siguiente botón `,
		[ERROR_RENEW]: `Ocurrió un error al renovar el DID de emisor en la Blockchain ${blockchain}. Por favor, volvé a reintentar la
    operación desde el botón RENOVAR`
	};

	const icons = {
		[ERROR]: <Icon />
	};

	return (
		messageError && (
			<>
				<Typography variant="subtitle2" style={{ margin: "20px 0px", color: "#ff0000" }}>
					{messages[status]}
					{icons[status]}.
				</Typography>
				<Grid container justify="flex-end">
					<span
						onClick={() => setOpen(v => !v)}
						style={{ color: "#0000ff", textDecoration: "underline", cursor: "pointer" }}
					>
						Ver detalle del error.
					</span>
				</Grid>
				<Collapse in={open} timeout="auto" unmountOnExit style={{ marginTop: "20px" }}>
					<Typography variant="body2" style={{ textAlign: "center", padding: "15px 10px", background: "#dddee5" }}>
						{messageError}
					</Typography>
				</Collapse>
			</>
		)
	);
};

export default CollapseMessageError;
