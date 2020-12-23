import React from "react";
import Constants, { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { AssignmentLate, Edit } from "@material-ui/icons";
import InputFilter from "../components/InputFilter";
import CustomSelect from "../components/CustomSelect";
import DateRangeFilter from "../components/DateRangeFilter/DateRangeFilter";
import { validateAccess } from "../../constants/Roles";

const COLUMNS_NAME = [
	{
		title: "acciones",
		name: "actions"
	}
];

const { Write_Users, Delete_Certs } = Constants.ROLES;

export const getUserColumns = COLUMNS_NAME.map(({ name, title, width }) => ({
	Header: (
		<div className="HeaderText">
			<p>{title}</p>
		</div>
	),
	accessor: name,
	width
}));

export const getUserAllColumns = (handleFilter, profiles, onDateRangeFilterChange) => [
	{
		Header: <InputFilter label="Nombre" onChange={handleFilter} field="name" />,
		accessor: "name"
	},
	{
		Header: <CustomSelect options={profiles.map(p => p.name)} field="profile" label="Perfil" onChange={handleFilter} />,
		accessor: "profile"
	},
	{
		Header: <DateRangeFilter label="fecha de creacion" onChange={onDateRangeFilterChange} />,
		accessor: "onCreated",
		width: 220
	},
	...getUserColumns
];

export const getUserData = (user, onDelete, onEdit) => {
	return {
		...user,
		onCreated: (
			<div style={{ textAlign: "center" }}>{user.createdOn ? moment(user.createdOn).format(DATE_FORMAT) : "-"}</div>
		),
		actions: !user.types.includes(Constants.ROLES.Admin) && (
			<div className="Actions">
				{validateAccess(Write_Users) && (
					<div className="EditAction" onClick={() => onEdit(user)}>
						<Tooltip title="Editar" placement="top" arrow>
							<Edit fontSize="medium" />
						</Tooltip>
					</div>
				)}
				{validateAccess(Delete_Certs) && (
					<div className="DeleteAction" onClick={() => onDelete(user)}>
						<Tooltip title="Borrar" placement="top" arrow>
							<AssignmentLate fontSize="medium" />
						</Tooltip>
					</div>
				)}
			</div>
		)
	};
};
