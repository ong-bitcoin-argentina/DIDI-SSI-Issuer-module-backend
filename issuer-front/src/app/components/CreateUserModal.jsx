import {
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	IconButton,
	TextField
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PropTypes from "prop-types";
import Constants from "../../constants/Constants";

const TITLE = "Usuario";

const {
	Read_Templates,
	Write_Templates,
	Delete_Templates,
	Read_Certs,
	Write_Certs,
	Delete_Certs,
	Read_Dids_Registers,
	Write_Dids_Registers,
	Read_Delegates,
	Write_Delegates
} = Constants.ROLES;

const GROUPS = {
	"Gestión de Templates de Credenciales:": [Read_Templates, Write_Templates, Delete_Templates],
	"Gestión de Credenciales:": [Read_Certs, Write_Certs, Delete_Certs],
	"Registro de DIDs:": [Read_Dids_Registers, Write_Dids_Registers],
	"Gestor de Delegados:": [Read_Delegates, Write_Delegates]
};

const READ_ROLES = {
	Certs: { options: [Write_Certs, Delete_Certs], value: Read_Certs },
	Templates: { options: [Write_Templates, Delete_Templates], value: Read_Templates },
	Registers: { options: [Write_Dids_Registers], value: Read_Dids_Registers },
	Delegates: { options: [Write_Delegates], value: Read_Delegates }
};

const CreateUserModal = ({ open, close, onSubmit, userData, title }) => {
	const [newUser, setNewUser] = useState(userData);
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		setNewUser(userData);
		if (userData.types) {
			userData.types.forEach(role => setRoles(roles_ => ({ ...roles_, [role]: true })));
		}
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
		setRoles({});
		if (title === "Editar") {
			setNewUser(userData);
			userData.types.forEach(role => setRoles(roles_ => ({ ...roles_, [role]: true })));
		} else {
			setNewUser({});
		}
		setShowPassword(false);
	};

	const handleSubmit = (event, values) => {
		event.preventDefault();
		try {
			setError("");
			if (newUser.password === newUser.repeatPassword) {
				const types = Object.keys(roles).filter(r => roles[r]);
				if (types.length === 0) {
					setError("Seleccione un permiso.");
					return;
				}
				setLoading(true);
				onSubmit({ ...newUser, types });
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

	const handleRole = event => {
		const { name, checked } = event.target;
		let otherOption;
		if (checked) {
			const shortName = name.split("_").reverse()[0];
			const { value } = READ_ROLES[shortName];
			otherOption = value;
		}
		setRoles(roles => ({ ...roles, [name]: checked, [otherOption]: checked }));
	};

	const isDisabled = role => {
		const nameRole = role.split("_");

		return nameRole[0] === "Read" && READ_ROLES[nameRole.reverse()[0]]?.options.some(r => roles[r]);
	};

	const changeGroup = groupName => event => {
		const { checked } = event.target;
		GROUPS[groupName].forEach(r => setRoles(roles_ => ({ ...roles_, [r]: checked })));
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
						<Grid item xs={9}>
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
							<h2>Permisos</h2>
							{Object.keys(GROUPS).map(groupName => (
								<Grid key={groupName} container xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												onChange={changeGroup(groupName)}
												checked={GROUPS[groupName].every(role => roles[role])}
												color="primary"
											/>
										}
										label={groupName}
									/>
									<Grid container justify="flex-end">
										<Grid item xs={10}>
											{GROUPS[groupName].map(role => (
												<Grid item xs={12}>
													<FormControlLabel
														key={role}
														control={
															<Checkbox
																checked={Boolean(roles[role])}
																onChange={handleRole}
																disabled={isDisabled(role)}
																name={role}
																color="primary"
															/>
														}
														label={Constants.ROLES_TRANSLATE[role]}
													/>
												</Grid>
											))}
										</Grid>
									</Grid>
								</Grid>
							))}
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
	userData: {}
};

export default CreateUserModal;
