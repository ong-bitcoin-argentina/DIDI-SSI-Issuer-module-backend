import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import DefaultButton from "../../setting/default-button";

const DELETE_TITLE = "Borrar Credenciales";
const MESSAGE = "Estás por eliminar la siguientes credenciales pendientes de emisión:";

const DeleteAllCertsDialog = ({ onDeleteSelects, selectedCerts, openDeleteAll, allCertificates, setOpenDeleteAll }) => {
	const handleClose = () => {
		setOpenDeleteAll(false);
	};

	const handleAccept = () => {
		handleClose();
		onDeleteSelects();
	};

	const getCerts = () => {
		return allCertificates.filter(t => selectedCerts.indexOf(t._id) > -1);
	};

	return (
		<Dialog open={openDeleteAll} onClose={handleClose}>
			<DialogTitle id="form-dialog-title">
				<div>{DELETE_TITLE}</div>
			</DialogTitle>
			<DialogContent style={{ margin: "0px 0 25px" }}>
				<Typography variant="body1">
					<b>{MESSAGE}</b>
				</Typography>
				{getCerts().map(({ _id, certName, firstName, lastName }) => (
					<Typography key={_id} style={{ marginTop: "5px" }}>
						- {certName} - {`${firstName} ${lastName}`}
					</Typography>
				))}
			</DialogContent>
			<DialogActions>
				<DefaultButton funct={handleClose} otherClass="CreateButtonOutlined" name="Cancelar" />
				<DefaultButton funct={handleAccept} name="Borrar" />
			</DialogActions>
		</Dialog>
	);
};

export default DeleteAllCertsDialog;
