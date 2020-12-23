import React from "react";
import Constants, { DATE_FORMAT, STATUS } from "../../constants/Constants";
import moment from "moment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import RefreshIcon from "@material-ui/icons/Refresh";
import EditIcon from "@material-ui/icons/Edit";
import InputFilter from "../components/InputFilter";
import Action from "../utils/Action";
import CustomSelect from "../components/CustomSelect";
import DateRangeFilter from "../components/DateRangeFilter/DateRangeFilter";

const { ERROR, PENDING, DONE, EXPIRED, ERROR_RENEW } = Constants.STATUS;

const EDIT_COLOR = "#5FCDD7";
const RETRY_COLOR = "#AED67B";

const COLUMNS_NAME = [
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

export const getRegisterAllColumns = (handleFilter, onDateRangeFilterChange) => {
	return [
		{
			Header: <InputFilter label="nombre" onChange={handleFilter} field="name" />,
			accessor: "name"
		},
		{
			Header: (
				<CustomSelect options={Constants.BLOCKCHAINS} field="blockchain" label="Blockchain" onChange={handleFilter} />
			),
			accessor: "blockchain"
		},
		{
			Header: <InputFilter label="did registrado" onChange={handleFilter} field="did" />,
			accessor: "did",
			width: 425
		},
		{
			Header: (
				<DateRangeFilter label="fecha de registro" onChange={value => onDateRangeFilterChange(value, "created")} />
			),
			accessor: "onCreated",
			width: 220
		},
		{
			Header: (
				<DateRangeFilter label="fecha de expiracion" onChange={value => onDateRangeFilterChange(value, "expired")} />
			),
			accessor: "expireOn",
			width: 220
		},
		{
			Header: (
				<CustomSelect options={Object.values(Constants.STATUS)} field="status" label="Estado" onChange={handleFilter} />
			),
			accessor: "status"
		},
		...getRegisterColumns
	];
};

const formatDate = date => (date ? moment(date).format(DATE_FORMAT) : "-");

export const getRegisterData = (register, onView, onEdit, onRetry) => {
	const { did, createdOn, expireOn, blockchain } = register;
	const partsOfDid = did.split(":");
	const keyDid = partsOfDid[partsOfDid.length - 1];
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
				{status === STATUS.ERROR && (
					<Action handle={() => onRetry(did)} title="Re-intentar" Icon={RefreshIcon} color={RETRY_COLOR} />
				)}
				<Action handle={() => onEdit(register)} title="Editar" Icon={EditIcon} color={EDIT_COLOR} />
				<Action handle={() => onView(register)} title="Ver" Icon={VisibilityIcon} color={EDIT_COLOR} />
			</div>
		)
	};
};
