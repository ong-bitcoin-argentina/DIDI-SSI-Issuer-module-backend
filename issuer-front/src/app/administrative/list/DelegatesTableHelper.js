import React from "react";
import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";
import { validateAccess } from "../../../constants/Roles";

class DelegatesTableHelpers {
	// genera las columnas de la tabla de modelos de delegados
	static getDelegatesData(delegate, onDelete, isLoading) {
		return {
			did: delegate.did,
			name: delegate.name,
			actions: validateAccess(Constants.ROLES.Write_Delegates) && (
				<div className="Actions">
					<div
						className="DeleteAction"
						onClick={() => {
							if (!isLoading()) onDelete(delegate.did);
						}}
					>
						{Messages.LIST.BUTTONS.DELETE}
					</div>
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de delegados
	static getDelegatesColumns() {
		return [
			{
				Header: Messages.LIST.TABLE.DID,
				accessor: "did"
			},
			{
				Header: Messages.LIST.TABLE.NAME,
				accessor: "name"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];
	}
}

export default DelegatesTableHelpers;
