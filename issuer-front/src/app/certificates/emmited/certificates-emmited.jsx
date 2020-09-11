import React, { useState, useEffect } from "react";
import "./_style.scss";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { Grid, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core";
import ReactTable from "react-table-6";
import Messages from "../../../constants/Messages";
import Constants, { DATE_FORMAT } from "../../../constants/Constants";
import { REVOCATION_REASONS } from "../../../constants/CertificateDefinitions";
import CertificateTableHelper from "../list/CertificateTableHelper";
import CertificateService from "../../../services/CertificateService";
import Cookie from "js-cookie";
import { useHistory } from "react-router-dom";
import { filter, filterByDates } from "../../../services/utils";
import Notification from "../../components/notification";
import FormSelect from "../../components/form-select";
import KeyValue from "../../components/key-value";
import moment from "moment";

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS, PAGE_SIZE } = Constants.CERTIFICATES.TABLE;

const CertificatesEmmited = () => {
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [filters, setFilters] = useState({});
	const [selected, setSelected] = useState({});
	const [allSelected, setAllSelected] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [filteredData, setFilteredData] = useState([]);
	const [activeCert, setActiveCert] = useState({});
	const [revokeReason, setRevokeReason] = useState("");
	const [revokeSuccess, setRevokeSuccess] = useState(false);
	const [revokeFail, setRevokeFail] = useState(false);
	const [loading, setLoading] = useState(true);
	const history = useHistory();

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

	useEffect(() => {
		const generated = {};
		filteredData.forEach(item => (generated[item._id] = allSelected));
		setSelected(generated);
	}, [allSelected]);

	const getData = async () => {
		const token = Cookie.get("token");
		setLoading(true);
		let certificates = await CertificateService.getEmmited(token);
		setLoading(false);
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

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	const onDateRangeFilterChange = ({ start, end }) => {
		setFilters(prev => ({ ...prev, start, end }));
	};

	const handleSelectOne = (id, checked) => {
		setSelected({ ...selected, [id]: checked });
	};

	const handleView = id => {
		history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	const handleRevokeOne = cert => {
		setActiveCert(cert);
		setModalOpen(true);
	};

	const handleRevokeConfirm = () => {
		const token = Cookie.get("token");
		const result = CertificateService.revoke(token, activeCert._id, revokeReason, onRevokeSuccess, onRevokeFail);
		setActiveCert(null);
		setRevokeReason("");
		toggleModal();
	};

	const onRevokeSuccess = requestData => {
		setRevokeSuccess(true);
		getData();
	};

	const onRevokeFail = errorData => {
		setRevokeFail(true);
	};

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	const handleRevokeSelected = () => {
		console.log("revoke selected");
	};

	const handleSelectAllToggle = val => {
		setAllSelected(val);
	};

	return (
		<>
			<Grid container spacing={3} className="flex-end" style={{ marginBottom: 10 }}>
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
				<Grid item xs={12} className="flex-end">
					<button
						className="DangerButton"
						onClick={handleRevokeSelected}
						disabled={!Object.values(selected).some(val => val)}
					>
						<RemoveCircleIcon fontSize="small" style={{ marginRight: 6 }} />
						Revocar Certificados Seleccionados
					</button>
				</Grid>
			</Grid>

			<Dialog open={modalOpen} onClose={toggleModal}>
				<DialogTitle id="form-dialog-title">
					<div>Estás por revocar la siguiente credencial:</div>
					<div style={{ marginTop: 10 }}>
						{activeCert && (
							<>
								<KeyValue field={"Nombre y Apellido"} value={`${activeCert.firstName} ${activeCert.lastName}`} />
								<KeyValue field={"Certificado"} value={activeCert.name} />
								<KeyValue field={"Fecha de creación"} value={moment(activeCert.createdOn).format(DATE_FORMAT)} />
								<KeyValue field={"Fecha de emisión"} value={moment(activeCert.emmitedOn).format(DATE_FORMAT)} />
							</>
						)}
					</div>
				</DialogTitle>
				<DialogContent style={{ margin: "0px 0 25px" }}>
					<FormSelect
						label="Razón de revocación"
						value={revokeReason}
						list={REVOCATION_REASONS}
						onChange={e => setRevokeReason(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={toggleModal} color="primary">
						Cancelar
					</Button>
					<Button onClick={handleRevokeConfirm} color="secondary" variant="contained" disabled={!revokeReason}>
						Revocar
					</Button>
				</DialogActions>
			</Dialog>

			<Notification open={revokeSuccess} message="La credencial se revocó con éxito." />

			<Notification
				open={revokeFail}
				severity="error"
				message="Ocurrió un error la revocar la credencial."
				time={3000}
			/>
		</>
	);
};

export default CertificatesEmmited;
