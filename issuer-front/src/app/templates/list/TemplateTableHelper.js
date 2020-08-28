import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Messages from "../../../constants/Messages";

class TemplateTableHelpers {
	// genera las columnas de la tabla de modelos de certificados
	static getTemplateData(template, onEdit, onDelete, isLoading) {
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
						<EditIcon fontSize="small" />
						{Messages.LIST.BUTTONS.EDIT}
					</div>
					<div
						className="DeleteAction"
						onClick={() => {
							if (!isLoading()) onDelete(template._id);
						}}
					>
						<DeleteIcon fontSize="small" />
						{Messages.LIST.BUTTONS.DELETE}
					</div>
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de modelos de certificados
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
