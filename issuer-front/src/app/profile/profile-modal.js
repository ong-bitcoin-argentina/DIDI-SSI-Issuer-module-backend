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
	TextField
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Constants from "../../constants/Constants";
import PropTypes from "prop-types";

const TITLE = "Perfil";

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

const ProfileModal = ({ open, close, onSubmit, profileData, title }) => {
	const [newProfile, setNewProfile] = useState(profileData);
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState({});
	const [error, setError] = useState("");

	useEffect(() => {
		setNewProfile(profileData);
		if (profileData.types) {
			profileData.types.forEach(role => setRoles(roles_ => ({ ...roles_, [role]: true })));
		}
	}, [profileData]);

	const resetState = () => {
		setRoles({});
		setError("");
		if (title === "Editar") {
			setNewProfile(profileData);
			profileData.types.forEach(role => setRoles(roles_ => ({ ...roles_, [role]: true })));
		} else {
			setNewProfile({});
		}
	};

	const handleCancel = event => {
		event.preventDefault();
		event.target.reset();
		resetState();
		close();
	};

	const handleSubmit = (event, values) => {
		event.preventDefault();
		try {
			setError("");
			const types = Object.keys(roles).filter(r => roles[r]);
			if (types.length === 0) {
				setError("Seleccione un permiso.");
				return;
			}
			setLoading(true);
			onSubmit({ ...newProfile, types });
			resetState();
			event.target.reset();
			close();

			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	const handleChange = event => {
		const { name, value } = event.target;
		setNewProfile(profile => ({ ...profile, [name]: value }));
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
							<TextField
								style={{ marginBottom: "25px" }}
								label="Nombre"
								name="name"
								type="text"
								onChange={handleChange}
								defaultValue={newProfile.name}
								required
								fullWidth
							/>
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

ProfileModal.propTypes = {
	profileData: PropTypes.object,
	open: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	close: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired
};

ProfileModal.defaultProps = {
	profileData: {}
};

export default ProfileModal;
