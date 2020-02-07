import React from "react";
import Messages from "../../constants/Messages";
import Constants from "../../constants/Constants";
import MaterialIcon from "material-icons-react";

class ParticipantsTableHelper {
	// genera las columnas de la tabla de certificados
	static getParticipantData(participant) {
		return {
			did: participant.did,
			name: participant.name,
			tel: (
				<did>
					{participant.tel && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.tel && <MaterialIcon color="red" icon={Constants.TEMPLATES.ICONS.MISSING} />}
				</did>
			),
			mail: (
				<did>
					{participant.mail && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.mail && <MaterialIcon color="red" icon={Constants.TEMPLATES.ICONS.MISSING} />}
				</did>
			),
			personal: (
				<did>
					{participant.personal && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.personal && <MaterialIcon color="red" icon={Constants.TEMPLATES.ICONS.MISSING} />}
				</did>
			),
			address: (
				<did>
					{participant.address && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.address && <MaterialIcon color="red" icon={Constants.TEMPLATES.ICONS.MISSING} />}
				</did>
			)
		};
	}

	// genera los headers para las columnas de la tabla de certificados
	static getParticipantColumns() {
		return [
			{
				Header: Messages.LIST.TABLE.NAME,
				accessor: "name"
			},
			{
				Header: Messages.LIST.TABLE.HAS_TEL,
				accessor: "tel"
			},
			{
				Header: Messages.LIST.TABLE.HAS_MAIL,
				accessor: "mail"
			},
			{
				Header: Messages.LIST.TABLE.HAS_PERSONAL,
				accessor: "personal"
			},
			{
				Header: Messages.LIST.TABLE.HAS_ADDRESS,
				accessor: "address"
			}
		];
	}
}

export default ParticipantsTableHelper;
