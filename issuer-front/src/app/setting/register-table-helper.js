import React from "react";
import Constants, { DATE_FORMAT, STATUS } from "../../constants/Constants";
import moment from "moment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import RefreshIcon from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit";
import { Tooltip } from "@material-ui/core";

const { ERROR, PENDING, DONE, EXPIRED, ERROR_RENEW } = Constants.STATUS;

const EDIT_COLOR = "#5FCDD7";
const RETRY_COLOR = "#AED67B";

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
	[DONE]: "#43D19D",
	[EXPIRED]: "#EB5757",
	[ERROR_RENEW]: "#EB5757"
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
	const isExpireOn = expireOn ? new Date(expireOn) < new Date() : false;
	const status = isExpireOn ? EXPIRED : register.status;

	return {
		...register,
		did: <div>{keyDid}</div>,
		blockchain: <div style={{ textTransform: "uppercase" }}>{blockchain}</div>,
		onCreated: <div style={{ textAlign: "center" }}>{formatDate(createdOn)}</div>,
		expireOn: <div style={{ textAlign: "center" }}>{formatDate(expireOn)}</div>,
		status: <div style={{ textAlign: "center", textTransform: "uppercase", color: COLORES[status] }}>{status}</div>,
		actions: (
			<div className="Actions">
				<Action handle={() => onEdit(register)} title="Editar" Icon={EditIcon} color={EDIT_COLOR} />
				<Action handle={() => onView(register)} title="Ver" Icon={VisibilityIcon} color={EDIT_COLOR} />
				{status === STATUS.ERROR && (
					<Action handle={() => onRetry(did)} title="Re-intentar" Icon={RefreshIcon} color={RETRY_COLOR} />
				)}
			</div>
		)
	};
};

const Action = ({ handle, title, Icon, color }) => (
	<div className="EditAction" onClick={handle}>
		<Tooltip title={title} placement="top" arrow>
			<Icon fontSize="medium" style={{ color: color }} />
		</Tooltip>
	</div>
);
