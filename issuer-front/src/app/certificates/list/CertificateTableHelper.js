import React from "react";
import Messages from "../../../constants/Messages";

import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class CertificateTableHelper {
	// genera las columnas de la tabla de certificados
	static getCertificatesData(
		cert,
		selectedCertificates,
		onCertificateSelectToggle,
		onCertificateEmmit,
		onCertificateEdit,
		onCertificateDelete
	) {
		const emmited = cert.emmitedOn;

		return {
			_id: cert._id,
			certName: cert.name,
			createdOn: emmited ? cert.emmitedOn.split("T")[0] : "-",
			firstName: cert.firstName,
			lastName: cert.lastName,
			select: (
				<div className="Actions">
					{!emmited && (
						<Checkbox
							checked={selectedCertificates[cert._id]}
							onChange={(_, value) => {
								onCertificateSelectToggle(cert._id, value);
							}}
						/>
					)}
				</div>
			),
			actions: (
				<div className="Actions">
					{!emmited && (
						<div
							className="EmmitAction"
							onClick={() => {
								onCertificateEmmit(cert._id);
							}}
						>
							{Messages.LIST.BUTTONS.EMMIT}
						</div>
					)}
					{
						<div
							className="EditAction"
							onClick={() => {
								onCertificateEdit(cert._id);
							}}
						>
							{emmited ? Messages.LIST.BUTTONS.VIEW : Messages.LIST.BUTTONS.EDIT}
						</div>
					}
					{!cert.emmitedOn && (
						<div
							className="DeleteAction"
							onClick={() => {
								onCertificateDelete(cert._id);
							}}
						>
							{Messages.LIST.BUTTONS.DELETE}
						</div>
					)}
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de certificados
	static getCertColumns(
		certificates,
		allSelectedCerts,
		onCertificateSelectAllToggle,
		onEmmitedFilterChange,
		onTemplateFilterChange,
		onFirstNameFilterChange,
		onLastNameFilterChange
	) {
		const certNames = [...new Set(certificates.map(cert => cert.certName))];

		return [
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.LAST_NAME}</div>
						<input type="text" className="TableInputFilter" onChange={onLastNameFilterChange} />
					</div>
				),
				accessor: "lastName"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.NAME}</div>
						<input type="text" className="TableInputFilter" onChange={onFirstNameFilterChange} />
					</div>
				),
				accessor: "firstName"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.CERT}</div>
						<Select className="TableInputFilter Checkbox" onChange={onTemplateFilterChange}>
							<MenuItem value={undefined} className="DataInput">
								{""}
							</MenuItem>
							{certNames.map((certName, key) => {
								return (
									<MenuItem value={certName} key={"cert-option-" + key} className="DataInput">
										{certName}
									</MenuItem>
								);
							})}
						</Select>
					</div>
				),
				accessor: "certName"
			},
			{
				Header: Messages.LIST.TABLE.EMISSION_DATE,
				accessor: "createdOn"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.ACTIONS}</div>
						<Select className="TableInputFilter Checkbox" onChange={onEmmitedFilterChange}>
							<MenuItem value={undefined} className="DataInput">
								{""}
							</MenuItem>
							<MenuItem value={"EMITIDOS"} className="DataInput">
								{"EMITIDOS"}
							</MenuItem>
							<MenuItem value={"NO EMITIDOS"} className="DataInput">
								{"NO EMITIDOS"}
							</MenuItem>
						</Select>
					</div>
				),
				accessor: "actions"
			},
			{
				Header: (
					<div>
						<div>{Messages.LIST.TABLE.SELECT}</div>
						<div className="Actions">
							<Checkbox
								checked={allSelectedCerts}
								onChange={(_, value) => {
									onCertificateSelectAllToggle(value);
								}}
							/>
						</div>
					</div>
				),
				accessor: "select"
			}
		];
	}
}

export default CertificateTableHelper;
