import React from "react";
import Constants, { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { AssignmentLate, Edit } from "@material-ui/icons";
import InputFilter from "../components/InputFilter";

const COLUMNS_NAME = [
	{
		title: "perfil",
		name: "profile"
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

export const getUserColumns = COLUMNS_NAME.map(({ name, title, width }) => ({
	Header: (
		<div className="HeaderText">
			<p>{title}</p>
		</div>
	),
	accessor: name,
	width
}));

export const getUserAllColumns = handleFilter => {
	return [
		{
			Header: <InputFilter label="Nombre" onChange={handleFilter} field="name" />,
			accessor: "name"
		},
		...getUserColumns
	];
};

export const getUserData = (user, onDelete, onEdit) => {
	return {
		...user,
		onCreated: (
			<div style={{ textAlign: "center" }}>{user.createdOn ? moment(user.createdOn).format(DATE_FORMAT) : "-"}</div>
		),
		actions: !user.types.includes(Constants.ROLES.Admin) && (
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
