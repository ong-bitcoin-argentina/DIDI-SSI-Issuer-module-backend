import React from "react";
import Messages from "../../constants/Messages";
import Constants from "../../constants/Constants";
import MaterialIcon from "material-icons-react";

import Checkbox from "@material-ui/core/Checkbox";

class ParticipantsTableHelper {
	// genera las columnas de la tabla de certificados
	static getParticipantData(participant, selectedParticipants, onParticipantSelectToggle) {
		return {
			did: participant.did,
			name: participant.name,
			tel: (
				<div>
					{participant.tel && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.tel && (
						<div className="Actions">
							<Checkbox
								checked={selectedParticipants["tel"][participant.did]}
								onChange={(_, value) => {
									onParticipantSelectToggle(participant.did, "tel", value);
								}}
							/>
						</div>
					)}
				</div>
			),
			mail: (
				<div>
					{participant.mail && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.mail && (
						<div className="Actions">
							<Checkbox
								checked={selectedParticipants["email"][participant.did]}
								onChange={(_, value) => {
									onParticipantSelectToggle(participant.did, "email", value);
								}}
							/>
						</div>
					)}
				</div>
			),
			personal: (
				<div>
					{participant.personal && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.personal && (
						<div className="Actions">
							<Checkbox
								checked={selectedParticipants["personal"][participant.did]}
								onChange={(_, value) => {
									onParticipantSelectToggle(participant.did, "personal", value);
								}}
							/>
						</div>
					)}
				</div>
			),
			address: (
				<div>
					{participant.address && <MaterialIcon color="green" icon={Constants.TEMPLATES.ICONS.OK} />}
					{!participant.address && (
						<div className="Actions">
							<Checkbox
								checked={selectedParticipants["address"][participant.did]}
								onChange={(_, value) => {
									onParticipantSelectToggle(participant.did, "address", value);
								}}
							/>
						</div>
					)}
				</div>
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
