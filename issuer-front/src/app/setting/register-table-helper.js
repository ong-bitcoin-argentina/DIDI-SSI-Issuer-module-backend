import React from "react";
import { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Tooltip } from "@material-ui/core";

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

export const getRegisterData = (register, onView) => {
	const { did, createdOn, expireOn, status } = register;
	const partsOfDid = did.split(":");
	const blockchain = partsOfDid[2];
	const keyDid = partsOfDid[3];
	return {
		...register,
		did: <div>{keyDid}</div>,
		blockchain: <div style={{ textTransform: "uppercase" }}>{blockchain}</div>,
		onCreated: <div style={{ textAlign: "center" }}>{formatDate(createdOn)}</div>,
		expireOn: <div style={{ textAlign: "center" }}>{formatDate(expireOn)}</div>,
		status: <div style={{ textAlign: "center", textTransform: "uppercase", color: "yellow" }}>{status}</div>,
		actions: (
			<div className="Actions">
				<div className="EditAction" onClick={() => onView(register)}>
					<Tooltip title="Ver" placement="top" arrow>
						<VisibilityIcon fontSize="medium" />
					</Tooltip>
				</div>
			</div>
		)
	};
};
