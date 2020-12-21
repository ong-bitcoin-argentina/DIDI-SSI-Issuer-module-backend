import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import Messages from "../../constants/Messages";

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
				<Button className="CloseModalButton" onClick={handleClose} color="secondary">
					{Messages.LIST.DIALOG.CANCEL}
				</Button>
				<Button className="CreateModalButton" onClick={onAccept} color="primary" variant="contained">
					Borrar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteAbstractModal;
