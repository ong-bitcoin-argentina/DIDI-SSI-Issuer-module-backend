import React from "react";
import Constants, { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { AssignmentLate, Edit } from "@material-ui/icons";
import InputFilter from "../components/InputFilter";
import CustomSelect from "../components/CustomSelect";
import DateRangeFilter from "../components/DateRangeFilter/DateRangeFilter";
import { validateAccess } from "../../constants/Roles";
import Cookie from "js-cookie";
import Action from "../utils/Action";

const COLUMNS_NAME = [
	{
		title: "acciones",
		name: "actions"
	}
];

const { Write_Users, Delete_Users } = Constants.ROLES;

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
		Header: <DateRangeFilter label="fecha de creación" onChange={onDateRangeFilterChange} />,
		accessor: "onCreated",
		width: 220
	},
	...getUserColumns
];

export const getUserData = (user, onDelete, onEdit) => {
	const local_user_id = Cookie.get("_id");
	const { _id } = user;
	return {
		...user,
		onCreated: (
			<div style={{ textAlign: "center" }}>{user.createdOn ? moment(user.createdOn).format(DATE_FORMAT) : "-"}</div>
		),
		actions: !user.types.includes(Constants.ROLES.Admin) && (
			<div className="Actions">
				{validateAccess(Delete_Users) && local_user_id !== _id && (
					<Action handle={() => onDelete(user)} title="Borrar" Icon={AssignmentLate} color="#EB5757" />
				)}
				{validateAccess(Write_Users) && <Action handle={() => onEdit(user)} title="Editar" Icon={Edit} />}
			</div>
		)
	};
};
