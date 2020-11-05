import React from "react";
import { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { AssignmentLate } from "@material-ui/icons";

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

export const getUserData = (user, onDelete) => {
	return {
		...user,
		onCreated: (
			<div style={{ textAlign: "center" }}>{user.onCreated ? moment(user.emmitedOn).format(DATE_FORMAT) : "-"}</div>
		),
		actions: (
			<div className="Actions">
				<div className="DeleteAction" onClick={() => onDelete(user)}>
					<Tooltip title="Borrar" placement="top" arrow>
						<AssignmentLate fontSize="medium" />
					</Tooltip>
				</div>
			</div>
		)
	};
};
