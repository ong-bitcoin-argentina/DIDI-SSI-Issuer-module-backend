import React from "react";
import Messages from "../../../constants/Messages";

import Checkbox from "@material-ui/core/Checkbox";
import TableHeadCheck from "../../components/table-head-check";
import CustomSelect from "../../components/custom-select";
import InputFilter from "../../components/input-filter";
import DateRangeFilter from "../../components/date-range-filter/date-range-filter";
import {
	PENDING_ACTIONS,
	EMMITED_ACTIONS,
	BASE_COLUMNS,
	EMMITED_COLUMNS
} from "../../../constants/CertificateDefinitions";

const { CERT, EMISSION_DATE, EMISSION_DATE2, REVOCATION } = Messages.LIST.TABLE;
const { VIEW } = Messages.LIST.BUTTONS;

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
		onEmmit,
		onEdit,
		onDelete,
		isLoading
	) {
		const ACTIONS = PENDING_ACTIONS({ cert, onEmmit, onEdit, onDelete });

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
					{ACTIONS.map((item, index) => (
						<div className={item.className} onClick={item.action} key={index}>
							{item.label}
						</div>
					))}
				</div>
			)
		};
	}

	static getCertificatesEmmitedData(cert, selectedCertificates, onCertificateSelectToggle, onView, onRevoke) {
		const ACTIONS = EMMITED_ACTIONS({ cert, onView, onRevoke });

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
					{ACTIONS.map((item, index) => (
						<div className={item.className} onClick={item.action} key={index}>
							{item.label}
						</div>
					))}
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

		const COLUMNS = EMMITED_COLUMNS({ onLastNameFilterChange, onFirstNameFilterChange });

		return [
			...COLUMNS.map(item => ({
				Header: <InputFilter label={item.label} onChange={item.action} />,
				accessor: item.accessor
			})),
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
			...BASE_COLUMNS.map(item => ({
				Header: <InputFilter label={item.label} onChange={onFilterChange} field={item.accessor} />,
				accessor: item.accessor
			})),
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
			...BASE_COLUMNS.map(item => ({
				Header: <InputFilter label={item.label} onChange={onFilterChange} field={item.accessor} />,
				accessor: item.accessor
			})),
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
