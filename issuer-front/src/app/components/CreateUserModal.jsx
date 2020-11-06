import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	MenuItem,
	Select,
	TextField
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PropTypes from "prop-types";

const TITLE = "Usuario";

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

const CreateUserModal = ({ open, close, onSubmit, userData, title }) => {
	const [newUser, setNewUser] = useState(userData);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		setNewUser(userData);
	}, [userData]);

	const INPUTS = [
		{
			name: "name",
			placeholder: "Nombre",
			type: "text"
		},
		{
			name: "password",
			placeholder: "Contraseña",
			type: showPassword ? "text" : "password"
		},
		{
			name: "repeatPassword",
			placeholder: "Repetir Contraseña",
			type: showPassword ? "text" : "password"
		}
	];

	const resetState = () => {
		setNewUser({ type: ROLES[0].value });
		setShowPassword(false);
	};

	const handleSubmit = (event, values) => {
		event.preventDefault();
		try {
			setError("");
			setLoading(true);
			if (newUser.password === newUser.repeatPassword) {
				onSubmit(newUser);
				resetState();
				event.target.reset();
				close();
			} else {
				setError("Las contraseñas no coinciden");
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	const handleCancel = event => {
		event.preventDefault();
		event.target.reset();
		resetState();
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
					<div>
						{title} {TITLE}
					</div>
				</DialogTitle>
				<DialogContent style={{ margin: "0px 0 25px" }}>
					<Grid container item xs={12} justify="center">
						<Grid item xs={8}>
							{INPUTS.map(({ name, placeholder, type }, index) => (
								<TextField
									key={index}
									style={{ marginBottom: "25px" }}
									id={`"user-${name}-input"`}
									label={placeholder}
									name={name}
									type={type}
									onChange={handleChange}
									defaultValue={newUser[name]}
									inputProps={{ minlength: name === "password" ? 6 : 1 }}
									required
									fullWidth
									InputProps={{
										endAdornment: name === "password" && (
											<IconButton style={{ padding: 0 }} onClick={() => setShowPassword(pw => !pw)}>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										)
									}}
								/>
							))}
							<Select
								id="user-select-input"
								required
								fullWidth
								name="type"
								defaultValue={newUser.type}
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
						{loading ? <CircularProgress size={20} color="white" /> : title}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

CreateUserModal.propTypes = {
	userData: PropTypes.object,
	open: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};

CreateUserModal.defaultProps = {
	userData: { type: ROLES[0].value }
};

export default CreateUserModal;
