import React, { useState, useEffect } from "react";
import "./_style.scss";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Messages from "../../../constants/Messages";
import Constants from "../../../constants/Constants";
import ReactTable from "react-table-6";
import { Grid, CircularProgress } from "@material-ui/core";
import CertificateTableHelper from "../list/CertificateTableHelper";
import CertificateService from "../../../services/CertificateService";
import Cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import { filter, filterByDates } from "../../../services/utils";

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS, PAGE_SIZE } = Constants.CERTIFICATES.TABLE;

const CertificatesEmmited = () => {
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [filters, setFilters] = useState({});
	const [selected, setSelected] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [filteredData, setFilteredData] = useState([]);
	const history = useHistory();

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	const onDateRangeFilterChange = ({ start, end }) => {
		setFilters(prev => ({ ...prev, start, end }));
	};

	const handleSelectOne = (id, checked) => {
		if (checked) {
			setSelected([...selected, id]);
		} else {
			setSelected(selected.filter(item => item._id !== id));
		}
	};

	const handleSelectAllToggle = val => {
		setAllSelected(val);
	};

	const handleView = id => {
		history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	const handleRevokeOne = id => {
		console.log("Revocar: " + id);
	};

	const handleRevokeSelected = () => {
		console.log("revoke selected");
	};

	useEffect(() => {
		if (data.length) {
			const localColumns = CertificateTableHelper.getCertEmmitedColumns(
				data,
				selected,
				allSelected,
				handleSelectAllToggle,
				onFilterChange,
				onDateRangeFilterChange
			);
			setColumns(localColumns);
		}
		setFilteredData(data);
	}, [data]);

	useEffect(() => {
		const getData = async () => {
			const token = Cookie.get("token");
			let certificates = await CertificateService.getEmmited(token);
			setData(
				certificates.map(item => {
					return CertificateTableHelper.getCertificatesEmmitedData(
						item,
						selected,
						handleSelectOne,
						handleView,
						handleRevokeOne
					);
				})
			);
		};
		getData();
	}, []);

	useEffect(() => {
		const { firstName, lastName, certName, start, end } = filters;
		const result = data.filter(
			row =>
				filter(row, "firstName", firstName) &&
				filter(row, "lastName", lastName) &&
				filter(row, "certName", certName) &&
				filterByDates(row, start, end)
		);
		setFilteredData(result);
	}, [filters]);

	return (
		<>
			<Grid container spacing={3} className="flex-end" style={{ marginBottom: 10 }}>
				<Grid item xs={12} style={{ textAlign: "center" }}>
					{filteredData ? (
						<ReactTable
							sortable={false}
							previousText={PREV}
							nextText={NEXT}
							data={filteredData}
							columns={columns}
							defaultPageSize={PAGE_SIZE}
							minRows={MIN_ROWS}
						/>
					) : (
						<CircularProgress />
					)}
				</Grid>
				<Grid item xs={12} className="flex-end">
					<button className="DangerButton" onClick={handleRevokeSelected} disabled={!selected.length}>
						<RemoveCircleIcon fontSize="small" style={{ marginRight: 6 }} />
						Revocar Certificados Seleccionados
					</button>
				</Grid>
			</Grid>
		</>
	);
};

export default CertificatesEmmited;
