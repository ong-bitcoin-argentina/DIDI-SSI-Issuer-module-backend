import React, { useEffect, useState } from "react";
import Constants from "../../constants/Constants";
import { CircularProgress } from "@material-ui/core";
import ReactTable from "react-table-6";
import Messages, { TAB_TEXT } from "../../constants/Messages";
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
import DescriptionGrid from "../components/DescriptionGrid";

const { TITLE, DESCRIPTION } = TAB_TEXT.SETTING;

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

	const reset = () => {
		getRegisters();
		setFilters({});
	};

	const handleRefresh = async did => {
		try {
			const token = Cookie.get("token");
			await RegisterService.refresh(did)(token);
			reset();
			setDetailModalOpen(false);
		} catch (error) {
			setError(error.message);
		}
	};

	const handleRevoke = async did => {
		try {
			const token = Cookie.get("token");
			await RegisterService.revoke(did)(token);
			reset();
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
				<DescriptionGrid title={TITLE} description={DESCRIPTION}>
					<OpenModalButton setModalOpen={setModalOpen} title="Nuevo Registro" />
				</DescriptionGrid>
			)}
			{error && (
				<div className="errMsg" style={{ width: "100%" }}>
					{error}
				</div>
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
			<RegisterModal modalOpen={modalOpen} setModalOpen={setModalOpen} onSuccess={reset} blockchains={blockchains} />
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
				onAccept={reset}
			/>
		</>
	);
};

export default Setting;
