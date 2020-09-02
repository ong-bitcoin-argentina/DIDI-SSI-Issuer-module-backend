import Messages from "./Messages";

const { EMMIT, DELETE, EDIT } = Messages.LIST.BUTTONS;

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
