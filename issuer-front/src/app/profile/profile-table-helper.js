import { Chip } from "@material-ui/core";
import React from "react";
import Constants from "../../constants/Constants";
import { Edit, Delete } from "@material-ui/icons";
import InputFilter from "../components/InputFilter";
import Action from "../utils/Action";

const EDIT_COLOR = "#5FCDD7";
const DELETE_COLOR = "#EB5757";

const COLUMNS_NAME = [
	{
		title: "tipos",
		name: "types",
		width: 1100
	},
	{
		title: "acciones",
		name: "actions"
	}
];

export const getProfileColumns = COLUMNS_NAME.map(({ name, title, width }) => ({
	Header: (
		<div className="HeaderText">
			<p>{title}</p>
		</div>
	),
	accessor: name,
	width
}));

export const getProfileAllColumns = handleFilter => {
	return [
		{
			Header: <InputFilter label="Nombre" onChange={handleFilter} field="name" />,
			accessor: "name"
		},
		...getProfileColumns
	];
};

export const getProfileData = (profile, onEdit, onDelete) => {
	return {
		...profile,
		types: profile.types.map(role => (
			<Chip
				style={{ marginRight: "5px", fontSize: "12px", fontWeight: "500" }}
				label={Constants.ROLES_TRANSLATE[role]}
			/>
		)),
		actions: (
			<div className="Actions">
				<Action handle={() => onEdit(profile)} title="Editar" Icon={Edit} color={EDIT_COLOR} />
				<Action handle={() => onDelete(profile)} title="Borrar" Icon={Delete} color={DELETE_COLOR} />
			</div>
		)
	};
};
