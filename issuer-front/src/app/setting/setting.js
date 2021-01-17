import React, { useEffect, useState } from "react";
import Constants from "../../constants/Constants";
import { CircularProgress, Grid } from "@material-ui/core";
import ReactTable from "react-table-6";
import Messages from "../../constants/Messages";
import RegisterModal from "./register-modal";
import NotRegistersData from "./not-registers-data";
import OpenModalButton from "./open-modal-button";
import RegisterService from "../../services/RegisterService";
import Cookie from "js-cookie";
import { getRegisterAllColumns, getRegisterData } from "./register-table-helper";
import ModalDetail from "./modal-detail";
import DefaultForm from "./default-form";
import EditRegisterModal from "./edit-register-modal";
import { filter, filterByDates } from "../../services/utils";

const Setting = () => {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [registerSelected, setRegisterSelected] = useState({});
	const [blockchains, setBlockchains] = useState([]);

	const [filters, setFilters] = useState({});
	const [filteredData, setFilteredData] = useState([]);

	const [data, setData] = useState([]);
	const [error, setError] = useState("");

	const ifNotElements = data.length === 0;

	useEffect(() => {
		const { name, created, expired, blockchain, did, status } = filters;
		const result = data.filter(
			row =>
				filter(row, "name", name) &&
				filterByDates(row, created?.start, created?.end) &&
				filterByDates(row, expired?.start, expired?.end, "expireOn") &&
				filter(row, "did", did) &&
				filter(row, "status", status) &&
				filter(row, "blockchain", blockchain)
		);
		setFilteredData(result);
	}, [filters]);

	const getRegisters = async () => {
		setLoading(true);
		const token = Cookie.get("token");
		try {
			const data = await RegisterService.getAll({})(token);
			setData(data);
			setFilteredData(data);
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	const getBlockchains = async () => {
		try {
			const token = Cookie.get("token");
			const blockchains_ = await RegisterService.getAllBlockchains()(token);
			setBlockchains(blockchains_);
		} catch (error) {
			setError(error.message);
		}
	};

	const onRetry = async did => {
		try {
			const token = Cookie.get("token");
			await RegisterService.retry(did)(token);
			getRegisters();
		} catch (error) {
			setError(error.message);
		}
	};

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	useEffect(() => {
		getRegisters();
		getBlockchains();
	}, []);

	const handleRefresh = async did => {
		try {
			const token = Cookie.get("token");
			await RegisterService.refresh(did)(token);
			getRegisters();
			setDetailModalOpen(false);
		} catch (error) {
			setError(error.message);
		}
	};

	const handleRevoke = async did => {
		try {
			const token = Cookie.get("token");
			await RegisterService.revoke(did)(token);
			getRegisters();
			setDetailModalOpen(false);
		} catch (error) {
			setError(error.message);
		}
	};

	const selectRegister = setModalFn => register => {
		setRegisterSelected(register);
		setModalFn(true);
	};

	const onDateRangeFilterChange = (value, key) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	return (
		<>
			{!loading && !ifNotElements && (
				<Grid container xs={12} style={{ margin: "10px 0" }}>
					<Grid item xs={8} container direction="column" style={{ textAlign: "start" }}>
						<h1 style={{ margin: "0", padding: "0" }}>Configuración</h1>
						<p>
							Registrate como Emisor de Credenciales en la/s blockchain/s que quieras verificar tus credenciales a
							emitir
						</p>
					</Grid>
					<Grid item xs={4} container justify="flex-end" alignItems="center">
						<OpenModalButton setModalOpen={setModalOpen} title="Nuevo Registro" />
					</Grid>
				</Grid>
			)}
			{(loading && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			)) ||
				(ifNotElements && <NotRegistersData setModalOpen={setModalOpen} />) || (
					<ReactTable
						sortable={true}
						previousText={Messages.LIST.TABLE.PREV}
						nextText={Messages.LIST.TABLE.NEXT}
						data={filteredData.map(register =>
							getRegisterData(register, selectRegister(setDetailModalOpen), selectRegister(setEditModalOpen), onRetry)
						)}
						columns={getRegisterAllColumns(onFilterChange, onDateRangeFilterChange)}
						minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
						defaultPageSize={5}
					/>
				)}
			<DefaultForm registers={data} />
			{error && (
				<div className="errMsg" style={{ width: "100%" }}>
					{error}
				</div>
			)}
			<RegisterModal
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				onSuccess={getRegisters}
				blockchains={blockchains}
			/>
			<ModalDetail
				handleRefresh={handleRefresh}
				handleRevoke={handleRevoke}
				modalOpen={detailModalOpen}
				setModalOpen={setDetailModalOpen}
				register={registerSelected}
			/>
			<EditRegisterModal
				modalOpen={editModalOpen}
				setModalOpen={setEditModalOpen}
				register={registerSelected}
				onAccept={getRegisters}
			/>
		</>
	);
};

export default Setting;
