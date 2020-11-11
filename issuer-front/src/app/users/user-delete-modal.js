import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import Messages from "../../constants/Messages";

const UserDeleteModal = ({ open, setOpen, onAccept }) => {
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog className="dialogBox" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="DialogTitle">Borrar Usuario</DialogTitle>
			<DialogContent>
				<div className="DeleteMessage">
					<span class="material-icons" style={{ marginBottom: "25px" }}>
						delete_outline
					</span>
					¿Está seguro que desea eliminar el Usuario?
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

export default UserDeleteModal;
