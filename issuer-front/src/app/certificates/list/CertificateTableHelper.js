import React from "react";
import Messages from "../../../constants/Messages";
import { DATE_FORMAT } from "../../../constants/Constants";

import Checkbox from "@material-ui/core/Checkbox";
import TableHeadCheck from "../../components/TableHeadCheck";
import CustomSelect from "../../components/CustomSelect";
import InputFilter from "../../components/InputFilter";
import DateRangeFilter from "../../components/DateRangeFilter/DateRangeFilter";

import {
	PENDING_ACTIONS,
	EMMITED_ACTIONS,
	BASE_COLUMNS,
	EMMITED_COLUMNS,
	REVOCATION_REASONS_PLAIN,
	REVOKED_ACTIONS
} from "../../../constants/CertificateDefinitions";
import moment from "moment";
import { Tooltip } from "@material-ui/core";

const { CERT, EMISSION_DATE, EMISSION_DATE2, REVOCATION } = Messages.LIST.TABLE;
const { VIEW } = Messages.LIST.BUTTONS;

class CertificateTableHelper {
	static baseCells = cert => ({
		_id: cert._id,
		certName: cert.name,
		createdOn: cert.emmitedOn ? moment(cert.emmitedOn).format(DATE_FORMAT) : "-",
		firstName: cert.firstName,
		lastName: cert.lastName
	});

	// genera las columnas de la tabla de credencial
	static getCertificatesPendingData(cert, selectedCertificates, onSelectToggle, onEmmit, onEdit, onDelete, isLoading) {
		const ACTIONS = PENDING_ACTIONS({ cert, onEmmit, onEdit, onDelete });

		const onToggle = (_, value) => {
			onSelectToggle(cert._id, value);
		};

		return {
			...this.baseCells(cert),
			select: (
				<div className="Actions">
					<Checkbox checked={selectedCertificates[cert._id]} onChange={onToggle} />
				</div>
			),
			actions: (
				<div className="Actions">
					{ACTIONS.map((item, index) => (
						<div className={item.className} onClick={item.action} key={index}>
							<Tooltip arrow title={item.label} placement="top">
								{item.iconComponent}
							</Tooltip>
						</div>
					))}
				</div>
			)
		};
	}

	static getCertificatesEmmitedData(cert, selectedCertificates, onSelectToggle, onView, onRevoke) {
		const ACTIONS = EMMITED_ACTIONS({ cert, onView, onRevoke });

		const onToggle = (_, value) => {
			onSelectToggle(cert._id, value);
		};

		return {
			...this.baseCells(cert),
			select: (
				<div className="Actions">
					<Checkbox checked={selectedCertificates[cert._id] || false} onChange={onToggle} />
				</div>
			),
			actions: (
				<div className="Actions">
					{ACTIONS.map((item, index) => (
						<div className={item.className} onClick={item.action} key={index}>
							<Tooltip title={item.label} placement="top" arrow>
								{item.iconComponent}
							</Tooltip>
						</div>
					))}
				</div>
			)
		};
	}

	static getCertificatesRevokedData(cert, onView) {
		const ACTIONS = REVOKED_ACTIONS({ cert, onView });

		return {
			...this.baseCells(cert),
			revokedOn: moment(cert.revocation.date).format(DATE_FORMAT),
			revokeReason: REVOCATION_REASONS_PLAIN[cert.revocation.reason],
			actions: (
				<div className="Actions">
					{ACTIONS.map((item, index) => (
						<div className={item.className} onClick={item.action} key={index}>
							<Tooltip title={item.label} placement="top" arrow>
								{item.iconComponent}
							</Tooltip>
						</div>
					))}
				</div>
			)
		};
	}

	// genera los headers para las columnas de la tabla de credencial
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
				Header: (
					<div className="SelectionTable">
						<InputFilter label={item.label} onChange={item.action} />
					</div>
				),
				accessor: item.accessor
			})),
			{
				Header: (
					<div className="SelectionTable">
						<CustomSelect options={certNames} label={CERT} onChange={onTemplateFilterChange} />
					</div>
				),
				accessor: "certName"
			},
			{
				Header: (
					<div className="HeaderText">
						<p>Acciones</p>
					</div>
				),
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
				Header: (
					<div className="SelectionTable">
						<CustomSelect options={certNames} label={CERT} onChange={onFilterChange} field="certName" />
					</div>
				),
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
				Header: (
					<div className="SelectionTable">
						<InputFilter label={item.label} onChange={onFilterChange} field={item.accessor} />
					</div>
				),
				accessor: item.accessor
			})),
			{
				Header: (
					<div className="SelectionTable">
						<CustomSelect options={certNames} label={CERT} onChange={onFilterChange} field="certName" />
					</div>
				),
				accessor: "certName"
			},
			{
				Header: `${EMISSION_DATE} ${EMISSION_DATE2}`,
				accessor: "createdOn"
			},
			{
				Header: `${EMISSION_DATE} ${REVOCATION}`,
				accessor: "revokedOn"
			},
			{
				Header: `Motivo de Revocación`,
				accessor: "revokeReason"
			},
			{
				Header: "Acciones",
				accessor: "actions"
			}
		];
	}
}

export default CertificateTableHelper;
