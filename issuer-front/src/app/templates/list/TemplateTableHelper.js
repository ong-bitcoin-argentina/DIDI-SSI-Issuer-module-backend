import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Visibility from "@material-ui/icons/Visibility";

import Messages from "../../../constants/Messages";

import Cookie from "js-cookie";
import Constants from "../../../constants/Constants";

const { Observer } = Constants.ROLES;

class TemplateTableHelpers {
	// genera las columnas de la tabla de modelos de credenciales
	static getTemplateData(template, onEdit, onDelete, isLoading) {
		const role = Cookie.get("role");
		return {
			_id: template._id,
			name: template.name,
			actions: (
				<div className="Actions">
					<div
						className="EditAction"
						onClick={() => {
							if (!isLoading()) onEdit(template._id);
						}}
					>
						{role === Observer ? <Visibility fontSize="medium" /> : <EditIcon fontSize="medium" />}
						{/* {Messages.LIST.BUTTONS.EDIT} */}
					</div>
					{role !== Observer && (
						<div
							className="DeleteAction"
							onClick={() => {
								if (!isLoading()) onDelete(template._id);
							}}
						>
							<DeleteIcon fontSize="medium" />
							{/* {Messages.LIST.BUTTONS.DELETE} */}
						</div>
					)}
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de modelos de credenciales
	static getTemplateColumns() {
		return [
			{
				Header: Messages.LIST.TABLE.TEMPLATE,
				accessor: "name"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];
	}
}

export default TemplateTableHelpers;
