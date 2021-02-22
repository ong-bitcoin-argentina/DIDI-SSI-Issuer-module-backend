import React, { useState, useEffect } from "react";
// import "./_style.scss";
import Messages from "../../../constants/Messages";
import Constants from "../../../constants/Constants";
import ReactTable from "react-table-6";
import { Grid, CircularProgress } from "@material-ui/core";
import CertificateTableHelper from "../list/CertificateTableHelper";
import CertificateService from "../../../services/CertificateService";
import Cookie from "js-cookie";
import { filter } from "../../../services/utils";
import { useHistory } from "react-router-dom";
import TabDescription from "../../components/TabDescription";

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS, PAGE_SIZE } = Constants.CERTIFICATES.TABLE;
const { EDIT_CERT } = Constants.ROUTES;

const CertificatesRevoked = () => {
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [filters, setFilters] = useState({});
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({});
	const history = useHistory();

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	const handleView = id => {
		history.push(EDIT_CERT + id);
	};

	useEffect(() => {
		if (data.length) {
			const localColumns = CertificateTableHelper.getCertRevokedColumns(data, onFilterChange);
			setColumns(localColumns);
		}
		setFilteredData(data);
	}, [data]);

	const getData = async () => {
		const token = Cookie.get("token");
		setLoading(true);
		try {
			let certificates = await CertificateService.getRevoked(token);
			setLoading(false);
			setData(
				certificates.map(item => {
					return CertificateTableHelper.getCertificatesRevokedData(item, handleView);
				})
			);
		} catch (error) {
			setError(error.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		const { firstName, lastName, certName, blockchain } = filters;
		const result = data.filter(
			row =>
				filter(row, "firstName", firstName) &&
				filter(row, "lastName", lastName) &&
				filter(row, "certName", certName) &&
				filter(row, "blockchain", blockchain)
		);
		setFilteredData(result);
	}, [filters]);

	return (
		<>
			<TabDescription tabName="CERTIFICATES_REVOKED" />
			<Grid container spacing={3} className="flex-end" style={{ marginBottom: 10 }}>
				{error.message && <div className="errMsg">{error.message}</div>}
				<Grid item xs={12} style={{ textAlign: "center" }}>
					{!loading ? (
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
			</Grid>
		</>
	);
};

export default CertificatesRevoked;
