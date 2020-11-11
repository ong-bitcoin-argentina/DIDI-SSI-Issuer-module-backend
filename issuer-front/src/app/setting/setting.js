import React, { useState } from "react";
import Constants from "../../constants/Constants";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
	Typography
} from "@material-ui/core";
import ReactTable from "react-table-6";
import Messages from "../../constants/Messages";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

const Setting = () => {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(true);
	const [data, setData] = useState([]);

	const ifNotElements = data.length === 0;

	const INPUTS = [
		{
			name: "did",
			placeholder: "DID asignado",
			disabled: true
		},
		{
			name: "name",
			placeholder: "Nombre",
			disabled: false
		}
	];

	return (
		<>
			<div className="HeadButtons">
				{!ifNotElements && (
					<button className="CreateButton" onClick={() => setModalOpen(true)}>
						<div className="CreateButtonText">Nuevo Registro</div>
					</button>
				)}
			</div>
			{(loading && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			)) ||
				(ifNotElements && (
					<Grid container justify="center" style={{ padding: "40px" }}>
						<Grid item xs={12} container justify="center" style={{ margin: "20px 0 40px 0" }}>
							<WarningRoundedIcon style={{ color: "#ffd124", transform: "scale(3.5)" }} />
						</Grid>
						<Typography variant="h6">
							Es necesario que te registres en al menos una Blockchain para poder operar
						</Typography>
						<Grid item xs={12} container justify="center" style={{ margin: "20px 0 20px 0" }}>
							<Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
								Nuevo Registro
							</Button>
						</Grid>
					</Grid>
				)) || (
					<ReactTable
						sortable={false}
						previousText={Messages.LIST.TABLE.PREV}
						nextText={Messages.LIST.TABLE.NEXT}
						data={[]}
						columns={[]}
						minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
					/>
				)}
			<Dialog open={modalOpen}>
				<form onSubmit={() => {}} onReset={() => {}}>
					<DialogTitle id="form-dialog-title">
						<div>Registro de Emisor</div>
					</DialogTitle>
					<DialogContent style={{ margin: "0px 0 25px" }}>
						<Grid container item xs={12} justify="center">
							<Grid item xs={8}>
								{INPUTS.map(({ name, placeholder, disabled }, index) => (
									<TextField
										disabled={disabled}
										key={index}
										style={{ marginBottom: "25px" }}
										id={`"emisor-${name}-input"`}
										label={placeholder}
										name={name}
										type="text"
										required
										onChange={() => {}}
										fullWidth
									/>
								))}
								{/* <Select
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
								</Select> */}
							</Grid>
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
		</>
	);
};

export default Setting;
