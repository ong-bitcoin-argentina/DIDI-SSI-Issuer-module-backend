import React from "react";
import Constants, { DATE_FORMAT, STATUS } from "../../constants/Constants";
import moment from "moment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import RefreshIcon from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit";
import { Tooltip } from "@material-ui/core";

const { ERROR, PENDING, DONE } = Constants.STATUS;

const COLUMNS_NAME = [
	{
		title: "Blockchain",
		name: "blockchain"
	},
	{
		title: "DID registrado",
		name: "did",
		width: 425
	},
	{
		title: "Nombre Registrado",
		name: "name"
	},
	{
		title: "Fecha de Registro",
		name: "onCreated"
	},
	{
		title: "Fecha de Expiración",
		name: "expireOn"
	},
	{
		title: "Estado",
		name: "status"
	},
	{
		title: "Acciones",
		name: "actions"
	}
];

const COLORES = {
	[ERROR]: "#EB5757",
	[PENDING]: "#F2994A",
	[DONE]: "#43D19D"
};

export const getRegisterColumns = COLUMNS_NAME.map(({ name, title, width }) => ({
	Header: (
		<div className="HeaderText">
			<p>{title}</p>
		</div>
	),
	accessor: name,
	width
}));

const formatDate = date => (date ? moment(date).format(DATE_FORMAT) : "-");

export const getRegisterData = (register, onView, onEdit, onRetry) => {
	const { did, createdOn, expireOn } = register;
	const partsOfDid = did.split(":");
	const blockchain = partsOfDid[2];
	const keyDid = partsOfDid[3];
	const isExpireOn = new Date(expireOn) < new Date();
	const status = isExpireOn ? STATUS.ERROR : register.status;

	return {
		...register,
		did: <div>{keyDid}</div>,
		blockchain: <div style={{ textTransform: "uppercase" }}>{blockchain}</div>,
		onCreated: <div style={{ textAlign: "center" }}>{formatDate(createdOn)}</div>,
		expireOn: <div style={{ textAlign: "center" }}>{formatDate(expireOn)}</div>,
		status: (
			<div style={{ textAlign: "center", textTransform: "uppercase", color: COLORES[status] }}>
				{isExpireOn ? "Expirado" : status}
			</div>
		),
		actions: (
			<div className="Actions">
				<div className="EditAction" onClick={() => onEdit(register)}>
					<Tooltip title="Editar" placement="top" arrow>
						<EditIcon fontSize="medium" style={{ color: "#5FCDD7" }} />
					</Tooltip>
				</div>
				<div className="EditAction" onClick={() => onView(register)}>
					<Tooltip title="Ver" placement="top" arrow>
						<VisibilityIcon fontSize="medium" style={{ color: "#5FCDD7" }} />
					</Tooltip>
				</div>
				{status === STATUS.ERROR && (
					<div className="EditAction" onClick={() => onRetry(did)}>
						<Tooltip title="Re-Intentar" placement="top" arrow>
							<RefreshIcon fontSize="medium" color="secondary" style={{ color: "#AED67B" }} />
						</Tooltip>
					</div>
				)}
			</div>
		)
	};
};
