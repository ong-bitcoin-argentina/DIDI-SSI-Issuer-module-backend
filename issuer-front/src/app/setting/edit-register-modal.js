import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import RegisterService from "../../services/RegisterService";
import Cookie from "js-cookie";
import ModalTitle from "../utils/modal-title";
import DefaultButton from "./default-button";

const TITLE = "Editar Nombre del Emisor";
const EQUALS_NAME_ERROR = "Ingrese un nuevo nombre";

const EditRegisterModal = ({ modalOpen, setModalOpen, register, onAccept }) => {
	const [error, setError] = useState("");
	const [newName, setNewName] = useState("");

	useEffect(() => {
		setNewName(register.name);
	}, [register]);

	const handleChange = event => {
		const { value } = event.target;
		setNewName(value);
	};

	const handleSubmit = async event => {
		event.preventDefault();
		if (register.name === newName) {
			setError(EQUALS_NAME_ERROR);
			return;
		}
		try {
			const token = Cookie.get("token");
			await RegisterService.editName(register.did, newName)(token);
			onAccept();
			handleReset();
		} catch (error) {
			setError(error.message);
		}
	};

	const handleReset = () => {
		setError("");
		setModalOpen(false);
	};

	return (
		<Dialog open={modalOpen}>
			<form onSubmit={handleSubmit} onReset={handleReset}>
				<DialogTitle id="form-dialog-title">
					<ModalTitle title={TITLE} />
				</DialogTitle>
				<DialogContent style={{ margin: "0 0 25px" }}>
					<Grid container justify="center" style={{ marginTop: "25px" }}>
						<Grid item xs={6}>
							<TextField
								placeholder="Nombre del Emisor"
								required
								error={error}
								helperText={error}
								id="emisor-name-input"
								label="Nombre del Emisor"
								name="name"
								onChange={handleChange}
								defaultValue={register.name}
								type="text"
								fullWidth
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<DefaultButton otherClass="CreateButtonOutlined" name="Cerrar" type="reset" />
					<DefaultButton name="Aceptar" type="submit" />
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditRegisterModal;
