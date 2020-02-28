import React from "react";
import Messages from "../../constants/Messages";
import Constants from "../../constants/Constants";
import MaterialIcon from "material-icons-react";

import Checkbox from "@material-ui/core/Checkbox";

class ParticipantsTableHelper {
	// genera las columnas de la tabla de certificados
	static getParticipantData(participant, selectedParticipants, onParticipantSelectToggle, isLoading) {
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
									if (!isLoading()) onParticipantSelectToggle(participant.did, "tel", value);
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
								checked={selectedParticipants["mail"][participant.did]}
								onChange={(_, value) => {
									if (!isLoading()) onParticipantSelectToggle(participant.did, "mail", value);
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
									if (!isLoading()) onParticipantSelectToggle(participant.did, "personal", value);
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
									if (!isLoading()) onParticipantSelectToggle(participant.did, "address", value);
								}}
							/>
						</div>
					)}
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de certificados
	static getParticipantColumns(selectedParticipants, allSelectedParts, onParticipantSelectAllToggle, isLoading) {
		return [
			{
				Header: Messages.LIST.TABLE.NAME,
				accessor: "name"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.HAS_TEL}</div>
						<div>{"(" + Object.values(selectedParticipants["tel"]).filter(val => val).length + ")"}</div>
						<div className="Actions">
							<Checkbox
								checked={allSelectedParts["tel"]}
								onChange={(_, value) => {
									if (!isLoading()) onParticipantSelectAllToggle("tel", value);
								}}
							/>
						</div>
					</div>
				),
				accessor: "tel"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.HAS_MAIL}</div>
						<div>{"(" + Object.values(selectedParticipants["mail"]).filter(val => val).length + ")"}</div>
						<div className="Actions">
							<Checkbox
								checked={allSelectedParts["mail"]}
								onChange={(_, value) => {
									if (!isLoading()) onParticipantSelectAllToggle("mail", value);
								}}
							/>
						</div>
					</div>
				),
				accessor: "mail"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.HAS_PERSONAL}</div>
						<div>{"(" + Object.values(selectedParticipants["personal"]).filter(val => val).length + ")"}</div>
						<div className="Actions">
							<Checkbox
								checked={allSelectedParts["personal"]}
								onChange={(_, value) => {
									if (!isLoading()) onParticipantSelectAllToggle("personal", value);
								}}
							/>
						</div>
					</div>
				),
				accessor: "personal"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.HAS_ADDRESS}</div>
						<div>{"(" + Object.values(selectedParticipants["address"]).filter(val => val).length + ")"}</div>
						<div className="Actions">
							<Checkbox
								checked={allSelectedParts["address"]}
								onChange={(_, value) => {
									if (!isLoading()) onParticipantSelectAllToggle("address", value);
								}}
							/>
						</div>
					</div>
				),
				accessor: "address"
			}
		];
	}
}

export default ParticipantsTableHelper;
