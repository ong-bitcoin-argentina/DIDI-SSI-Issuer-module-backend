import React, { isValidElement, useEffect, useState } from "react";
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
	TextField,
	Typography
} from "@material-ui/core";
import { Credentials } from "uport-credentials";
import RegisterService from "../../services/RegisterService";
import Cookie from "js-cookie";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

const RegisterModal = ({ modalOpen, setModalOpen, onSuccess, blockchains }) => {
	const [identity, setIdentity] = useState({});
	const [newRegister, setNewRegister] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const identity_ = Credentials.createIdentity();
		const did = identity_.did.split(":")[2];
		const key = identity_.privateKey;
		setIdentity({ did });
		setNewRegister({ key });
	}, [modalOpen]);

	const INPUTS = [
		{
			name: "did",
			placeholder: "DID asignado",
			disabled: true,
			initial: identity.did
		},
		{
			name: "name",
			placeholder: "Nombre",
			disabled: false,
			initial: ""
		}
	];

	const handleChange = event => {
		const { name, value } = event.target;
		if (name === "blockchain") {
			setNewRegister(register => ({ ...register, did: `did:ethr:${value}:${identity.did}` }));
		} else {
			setNewRegister(register => ({ ...register, [name]: value }));
		}
	};

	const resetForm = () => {
		setIdentity({});
		setNewRegister({});
		setError("");
		setModalOpen(false);
	};

	const handleSubmit = async event => {
		event.preventDefault();

		if (!newRegister.did) {
			setError("Selecciones una blockchain");
			return;
		}

		setLoading(true);
		try {
			const token = Cookie.get("token");
			await RegisterService.create(newRegister)(token);
			resetForm();
			onSuccess();
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	const handleReset = event => {
		event.preventDefault();
		resetForm();
	};

	return (
		<Dialog open={modalOpen}>
			<form onSubmit={handleSubmit} onReset={handleReset}>
				<DialogTitle id="form-dialog-title">
					<h3 style={{ margin: "0px" }}>Registro de Emisor</h3>
				</DialogTitle>
				<DialogContent style={{ margin: "0px 0 25px" }}>
					<Grid container item xs={12} justify="center">
						<Grid
							item
							style={{ marginBottom: "10px", background: "#FAFAFA" }}
							xs={8}
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item xs={2} style={{ textAlign: "center", color: "#3f51b5" }}>
								<AssignmentIndIcon fontSize="large" />
							</Grid>
							<Grid item xs={10} style={{ padding: "10px", textAlign: "center" }}>
								<Typography variant="body2">
									Completá los siguientes campos para registrarte como Emisor de Credenciales en Blockchain que quieras
									uitilizar.
								</Typography>
							</Grid>
						</Grid>
						<Grid
							item
							style={{ margin: "10px 0 25px", background: "#FAFAFA" }}
							xs={8}
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item xs={12} style={{ padding: "10px", textAlign: "center" }}>
								<Typography variant="body2">
									La ejecución de esta operación puede demorar varios minutos. El registro quedará en estado PENDIENTE
									hasta tanto se confirme la transacción.
								</Typography>
							</Grid>
						</Grid>
						<Grid item xs={8}>
							{INPUTS.map(({ name, placeholder, disabled, initial }, index) => (
								<TextField
									disabled={disabled}
									key={index}
									style={{ marginBottom: "25px" }}
									id={`"emisor-${name}-input"`}
									label={placeholder}
									name={name}
									defaultValue={initial}
									type="text"
									required
									onChange={handleChange}
									fullWidth
								/>
							))}
							<Select id="emisor-select-input" required fullWidth name="blockchain" onChange={handleChange}>
								{blockchains.map((blockchain, index) => (
									<MenuItem key={index} value={blockchain}>
										<span style={{ textTransform: "uppercase" }}>{blockchain}</span>
									</MenuItem>
								))}
							</Select>
						</Grid>
						{error && (
							<div className="errMsg" style={{ width: "100%" }}>
								{error}
							</div>
						)}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="secondary" type="reset" disabled={loading}>
						Cancelar
					</Button>
					<Button color="primary" variant="contained" type="submit" disabled={loading}>
						{loading ? <CircularProgress size={20} color="white" /> : "Registrarme"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default RegisterModal;
