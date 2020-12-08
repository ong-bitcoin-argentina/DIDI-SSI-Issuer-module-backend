import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import RegisterService from "../../services/RegisterService";
import Cookie from "js-cookie";

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
			await RegisterService.editName(token, register.did, newName);
			onAccept();
			handleReset();
		} catch (error) {
			setError(error.response.data);
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
					<div>{TITLE}</div>
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
					<Button color="primary" type="reset">
						cerrar
					</Button>
					<Button color="primary" variant="contained" type="submit">
						aceptar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditRegisterModal;
