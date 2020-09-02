import React, { useState, useEffect } from "react";
// import "./_style.scss";
import Messages from "../../../constants/Messages";
import Constants from "../../../constants/Constants";
import ReactTable from "react-table-6";
import { Grid, CircularProgress } from "@material-ui/core";
import CertificateTableHelper from "../list/CertificateTableHelper";
import CertificateService from "../../../services/CertificateService";
import Cookie from "js-cookie";
const mock = [
	{
		actions: {},
		name: "prueba",
		emmitedOn: "2020-09-01",
		revokedOn: "2020-09-03",
		firstName: "adigalbeto",
		lastName: "lay",
		select: {},
		_id: "5f4ec6559c70c100456da15e"
	},
	{
		actions: {},
		name: "sadasd",
		emmitedOn: "2020-09-01",
		revokedOn: "2020-09-03",
		firstName: "Juan",
		lastName: "Caralarga",
		select: {},
		_id: "5f4e6559d30baf004f678c5d"
	}
];

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS, PAGE_SIZE } = Constants.CERTIFICATES.TABLE;

const CertificatesRevoked = () => {
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState(mock);
	const [filteredData, setFilteredData] = useState(mock);

	const onFilterChange = (key, value) => {
		// setFilteredCertificates({ key, value });
	};

	const handleView = id => {
		console.log(id);
	};

	const getData = async () => {
		// const token = Cookie.get("token");
		// let certificates = await CertificateService.getRevoked(token);
		let certificates = mock;
		setData(
			certificates.map(item => {
				return CertificateTableHelper.getCertificatesRevokedData(item, handleView);
			})
		);
	};

	useEffect(() => {
		if (data.length) {
			const localColumns = CertificateTableHelper.getCertRevokedColumns(data, onFilterChange);
			setColumns(localColumns);
		}
		setFilteredData(data);
	}, [data]);

	useEffect(() => {
		getData();
	}, []);

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
			</Grid>
		</>
	);
};

export default CertificatesRevoked;
