import Messages from "./Messages";

const { LAST_NAME, NAME } = Messages.LIST.TABLE;
const { EMMIT, DELETE, EDIT, VIEW, REVOKE } = Messages.LIST.BUTTONS;

export const PENDING_ACTIONS = ({ cert, onEmmit, onEdit, onDelete }) => [
	{
		className: "EmmitAction",
		action: () => onEmmit(cert._id),
		label: EMMIT
	},
	{
		className: "EditAction",
		action: () => onEdit(cert._id),
		label: EDIT
	},
	{
		className: "DeleteAction",
		action: () => onDelete(cert._id),
		label: DELETE
	}
];

export const EMMITED_ACTIONS = ({ cert, onView, onRevoke }) => [
	{
		className: "EditAction",
		action: () => onView(cert._id),
		label: VIEW
	},
	{
		className: "DeleteAction",
		action: () => onRevoke(cert),
		label: REVOKE
	}
];

export const BASE_COLUMNS = [
	{
		label: LAST_NAME,
		accessor: "lastName"
	},
	{
		label: NAME,
		accessor: "firstName"
	}
];

export const EMMITED_COLUMNS = ({ onLastNameFilterChange, onFirstNameFilterChange }) => [
	{
		label: LAST_NAME,
		action: e => onLastNameFilterChange(e),
		accessor: "lastName"
	},
	{
		label: NAME,
		action: e => onFirstNameFilterChange(e),
		accessor: "firstName"
	}
];

export const REVOCATION_REASONS = [
	{
		value: "EXPIRATION",
		label: "Expiración"
	},
	{
		value: "UNLINKING",
		label: "Desvinculación"
	},
	{
		value: "DATA_MODIFICATION",
		label: "Modificación de datos"
	},
	{
		value: "REPLACEMENT",
		label: "Reemplazo"
	},
	{
		value: "OTHER",
		label: "Otro"
	}
];
