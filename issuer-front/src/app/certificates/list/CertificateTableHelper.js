import React from "react";
import Messages from "../../../constants/Messages";

import Checkbox from "@material-ui/core/Checkbox";
import TableHeadCheck from "../../components/table-head-check";
import CustomSelect from "../../components/custom-select";
import InputFilter from "../../components/input-filter";
import DateRangeFilter from "../../components/date-range-filter/date-range-filter";

const { LAST_NAME, NAME, CERT, EMISSION_DATE, EMISSION_DATE2, REVOCATION } = Messages.LIST.TABLE;
const { VIEW, EMMIT, DELETE, EDIT, REVOKE } = Messages.LIST.BUTTONS;

class CertificateTableHelper {
	static baseCells = cert => ({
		_id: cert._id,
		certName: cert.name,
		createdOn: cert.emmitedOn ? cert.emmitedOn.split("T")[0] : "-",
		firstName: cert.firstName,
		lastName: cert.lastName
	});

	// genera las columnas de la tabla de certificados
	static getCertificatesPendingData(
		cert,
		selectedCertificates,
		onCertificateSelectToggle,
		onCertificateEmmit,
		onCertificateEdit,
		onCertificateDelete,
		isLoading
	) {
		return {
			...this.baseCells(cert),
			select: (
				<div className="Actions">
					{/* 
					<Checkbox
						checked={selectedCertificates[cert._id]}
						onChange={(_, value) => {
							if (!isLoading()) onCertificateSelectToggle(cert._id, value);
						}}
					/> 
					*/}
				</div>
			),
			actions: (
				<div className="Actions">
					<div className="EmmitAction" onClick={() => onCertificateEmmit(cert._id)}>
						{EMMIT}
					</div>

					<div className="EditAction" onClick={() => onCertificateEdit(cert._id)}>
						{EDIT}
					</div>

					<div className="DeleteAction" onClick={() => onCertificateDelete(cert._id)}>
						{DELETE}
					</div>
				</div>
			)
		};
	}

	static getCertificatesEmmitedData(
		cert,
		selectedCertificates,
		onCertificateSelectToggle,
		onCertificateView,
		onCertificateRevoke
	) {
		return {
			...this.baseCells(cert),
			select: (
				<div className="Actions">
					<Checkbox
						checked={selectedCertificates[cert._id]}
						onChange={(_, value) => onCertificateSelectToggle(cert._id, value)}
					/>
				</div>
			),
			actions: (
				<div className="Actions">
					<div className="EditAction" onClick={() => onCertificateView(cert._id)}>
						{VIEW}
					</div>

					<div className="DeleteAction" onClick={() => onCertificateRevoke(cert._id)}>
						{REVOKE}
					</div>
				</div>
			)
		};
	}

	static getCertificatesRevokedData(cert, onCertificateView) {
		return {
			...this.baseCells(cert),
			revokedOn: cert.revokedOn,
			actions: (
				<div className="Actions">
					<div className="EditAction" onClick={() => onCertificateView(cert._id)}>
						{VIEW}
					</div>
				</div>
			)
		};
	}

	static getCertificatesRevokedColumns(certificates, onFilterChange) {
		const certNames = [...new Set(certificates.map(cert => cert.certName))];

		return [
			{
				Header: <InputFilter label={LAST_NAME} onChange={onFilterChange} />,
				accessor: "lastName"
			},
			{
				Header: <InputFilter label={NAME} onChange={onFilterChange} />,
				accessor: "firstName"
			},
			{
				Header: <CustomSelect options={certNames} label={CERT} onChange={onFilterChange} />,
				accessor: "certName"
			},
			{
				Header: <InputFilter label={`${EMISSION_DATE} ${EMISSION_DATE2}`} onChange={onFilterChange} />,
				accessor: "createdOn"
			},
			{
				Header: <InputFilter label={`${EMISSION_DATE} ${REVOCATION}`} onChange={onFilterChange} />,
				accessor: "revokedOn"
			}
		];
	}

	// genera los headers para las columnas de la tabla de certificados
	static getCertColumns(
		certificates,
		selectedCerts,
		allSelectedCerts,
		onCertificateSelectAllToggle,
		onTemplateFilterChange,
		onFirstNameFilterChange,
		onLastNameFilterChange,
		isLoading
	) {
		const certNames = [...new Set(certificates.map(cert => cert.certName))];

		return [
			{
				Header: <InputFilter label={LAST_NAME} onChange={onLastNameFilterChange} />,
				accessor: "lastName"
			},
			{
				Header: <InputFilter label={NAME} onChange={onFirstNameFilterChange} />,
				accessor: "firstName"
			},
			{
				Header: <CustomSelect options={certNames} label={CERT} onChange={onTemplateFilterChange} />,
				accessor: "certName"
			},
			{
				Header: "Acciones",
				accessor: "actions"
			},
			{
				Header: (
					<TableHeadCheck selected={selectedCerts} all={allSelectedCerts} onChange={onCertificateSelectAllToggle} />
				),
				accessor: "select"
			}
		];
	}

	static getCertEmmitedColumns(
		certificates,
		selectedRows,
		isAllSelected,
		onSelectAllToggle,
		onFilterChange,
		onDateRangeFilterChange
	) {
		// TODO: refactor this to get templates names from backend
		const certNames = [...new Set(certificates.map(cert => cert.certName))];

		return [
			{
				Header: <InputFilter label={LAST_NAME} onChange={onFilterChange} field="lastName" />,
				accessor: "lastName"
			},
			{
				Header: <InputFilter label={NAME} onChange={onFilterChange} field="firstName" />,
				accessor: "firstName"
			},
			{
				Header: <CustomSelect options={certNames} label={CERT} onChange={onFilterChange} field="certName" />,
				accessor: "certName"
			},
			{
				Header: <DateRangeFilter label={`${EMISSION_DATE} ${EMISSION_DATE2}`} onChange={onDateRangeFilterChange} />,
				accessor: "createdOn"
			},
			{
				Header: "Acciones",
				accessor: "actions"
			},
			{
				Header: <TableHeadCheck selected={selectedRows} all={isAllSelected} onChange={onSelectAllToggle} />,
				accessor: "select"
			}
		];
	}

	static getCertRevokedColumns(certificates, onFilterChange) {
		// TODO: refactor this to get templates names from backend
		const certNames = [...new Set(certificates.map(cert => cert.certName))];

		return [
			{
				Header: <InputFilter label={LAST_NAME} onChange={onFilterChange} field="lastName" />,
				accessor: "lastName"
			},
			{
				Header: <InputFilter label={NAME} onChange={onFilterChange} field="firstName" />,
				accessor: "firstName"
			},
			{
				Header: <CustomSelect options={certNames} label={CERT} onChange={onFilterChange} field="certName" />,
				accessor: "certName"
			},
			{
				Header: `${EMISSION_DATE} ${EMISSION_DATE2}`,
				accessor: "createdOn"
			},
			{
				Header: `${EMISSION_DATE} ${REVOCATION}`,
				accessor: "revokedOn"
			}
		];
	}
}

export default CertificateTableHelper;
