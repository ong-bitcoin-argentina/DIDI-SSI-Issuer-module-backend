import React, { useEffect, useState } from "react";
import {
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
import ModalTitle from "../utils/modal-title";
import ClipBoardInput from "../components/ClipBoardInput";
import DefaultButton from "./default-button";

const TITLE = "Registro de Emisor";

const RegisterModal = ({ modalOpen, setModalOpen, onSuccess, blockchains }) => {
	const [newRegister, setNewRegister] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const identity_ = Credentials.createIdentity();
		const did = identity_.did.split(":")[2];
		const key = identity_.privateKey;
		setNewRegister({ key, did });
	}, [modalOpen]);

	const INPUTS = [
		{
			name: "name",
			placeholder: "Nombre",
			disabled: false,
			initial: ""
		}
	];

	const handleChange = event => {
		const { name, value } = event.target;
		setNewRegister(register => ({ ...register, [name]: value }));
	};

	const resetForm = () => {
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
			const { did, blockchain } = newRegister;
			await RegisterService.create({
				...newRegister,
				did: `did:ethr:${blockchain}:${did}`
			})(token);
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
					<ModalTitle title={TITLE} />
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
									utilizar.
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
									La ejecución de esta operación puede demorar. El registro quedará en estado CREANDO hasta tanto se
									confirme la transacción.
								</Typography>
							</Grid>
						</Grid>
						<Grid item xs={8}>
							<ClipBoardInput label="Did Asignado" value={newRegister.did} name="did" handleChange={handleChange} />
							<ClipBoardInput label="Clave Privada" value={newRegister.key} name="key" handleChange={handleChange} />
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
					<DefaultButton otherClass="DangerButtonOutlined" name="Cancelar" type="reset" disabled={loading} />
					<DefaultButton name="Registrarme" type="submit" disabled={loading} loading={loading} />
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default RegisterModal;
