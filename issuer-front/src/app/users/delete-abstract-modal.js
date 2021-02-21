import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import Messages from "../../constants/Messages";
import DefaultButton from "../setting/default-button";

const DeleteAbstractModal = ({ open, setOpen, onAccept, title }) => {
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog className="dialogBox" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="DialogTitle">Borrar {title}</DialogTitle>
			<DialogContent>
				<div className="DeleteMessage">
					<span class="material-icons" style={{ marginBottom: "25px" }}>
						delete_outline
					</span>
					¿Está seguro que desea eliminar el {title}?
				</div>
			</DialogContent>
			<DialogActions>
				<DefaultButton funct={handleClose} otherClass="DangerButtonOutlined" name={Messages.LIST.DIALOG.CANCEL} />
				<DefaultButton funct={onAccept} name="Borrar" />
			</DialogActions>
		</Dialog>
	);
};

export default DeleteAbstractModal;
