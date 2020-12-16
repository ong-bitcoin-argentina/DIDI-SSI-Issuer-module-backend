import { Chip, Tooltip } from "@material-ui/core";
import React from "react";
import Constants from "../../constants/Constants";
import { Edit, Delete } from "@material-ui/icons";
import InputFilter from "../components/InputFilter";

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
				<div className="EditAction" onClick={() => onEdit(profile)}>
					<Tooltip title="Editar" placement="top" arrow>
						<Edit fontSize="medium" />
					</Tooltip>
				</div>
				<div className="EditAction" onClick={() => onDelete(profile._id)}>
					<Tooltip title="Borrar" placement="top" arrow>
						<Delete fontSize="medium" color="secondary" />
					</Tooltip>
				</div>
			</div>
		)
	};
};
