import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	Select,
	TextField
} from "@material-ui/core";
import React, { useState } from "react";

const TITLE = "Alta de Usuario";

const ROLES = [
	{
		value: "Manager",
		name: "Gestor"
	},
	{
		value: "Observer",
		name: "Visualizador"
	}
];

const CreateUserModal = ({ open, close, onSuccess }) => {
	const [newUser, setNewUser] = useState({ type: ROLES[0].value });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = (event, values) => {
		event.preventDefault();
		try {
			setLoading(true);
			console.log(newUser, "hola");
			//envio la data
			onSuccess();
			setNewUser({ type: ROLES[0].value });
			event.target.reset();
			setLoading(false);
			close();
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	const handleCancel = event => {
		event.preventDefault();
		event.target.reset();
		setNewUser({ type: ROLES[0].value });
		close();
	};

	const handleChange = event => {
		const { name, value } = event.target;
		setNewUser(user => ({ ...user, [name]: value }));
	};

	return (
		<Dialog open={open}>
			<form onSubmit={handleSubmit} onReset={handleCancel}>
				<DialogTitle id="form-dialog-title">
					<div>{TITLE}</div>
				</DialogTitle>
				<DialogContent style={{ margin: "0px 0 25px" }}>
					<Grid container item xs={12} justify="center">
						<Grid item xs={8}>
							<TextField
								style={{ marginBottom: "25px" }}
								id="user-name-input"
								label="Nombre"
								type="text"
								name="name"
								required
								fullWidth
								onChange={handleChange}
							/>
							<TextField
								style={{ marginBottom: "25px" }}
								id="user-password-input"
								label="Contraseña"
								type="password"
								name="password"
								onChange={handleChange}
								required
								fullWidth
							/>
							<Select
								id="user-select-input"
								required
								fullWidth
								name="type"
								defaultValue={ROLES[0].value}
								onChange={handleChange}
							>
								{ROLES.map(({ name, value }, index) => (
									<MenuItem key={index} value={value}>
										{name}
									</MenuItem>
								))}
							</Select>
							{error && <div className="errMsg">{error}</div>}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="secondary" type="reset" disabled={loading}>
						Cancelar
					</Button>
					<Button color="primary" variant="contained" type="submit" disabled={loading}>
						{loading ? <CircularProgress size={20} color="white" /> : "Crear"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default CreateUserModal;
