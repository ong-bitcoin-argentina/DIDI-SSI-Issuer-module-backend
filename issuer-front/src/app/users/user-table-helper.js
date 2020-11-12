import React from "react";
import Constants, { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { AssignmentLate, Edit } from "@material-ui/icons";

const COLUMNS_NAME = [
	{
		title: "nombre",
		name: "name"
	},
	{
		title: "tipo",
		name: "type"
	},
	{
		title: "fecha de creacion",
		name: "onCreated"
	},
	{
		title: "acciones",
		name: "actions"
	}
];

export const getUserColumns = COLUMNS_NAME.map(({ name, title }) => ({
	Header: (
		<div className="HeaderText">
			<p>{title}</p>
		</div>
	),
	accessor: name
}));

export const getUserData = (user, onDelete, onEdit) => {
	return {
		...user,
		onCreated: (
			<div style={{ textAlign: "center" }}>{user.createdOn ? moment(user.createdOn).format(DATE_FORMAT) : "-"}</div>
		),
		actions: user.type !== Constants.ROLES.Admin && (
			<div className="Actions">
				<div className="EditAction" onClick={() => onEdit(user)}>
					<Tooltip title="Editar" placement="top" arrow>
						<Edit fontSize="medium" />
					</Tooltip>
				</div>
				<div className="DeleteAction" onClick={() => onDelete(user)}>
					<Tooltip title="Borrar" placement="top" arrow>
						<AssignmentLate fontSize="medium" />
					</Tooltip>
				</div>
			</div>
		)
	};
};
