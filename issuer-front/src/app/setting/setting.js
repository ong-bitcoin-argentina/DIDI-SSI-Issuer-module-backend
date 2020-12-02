import React, { useEffect, useState } from "react";
import Constants from "../../constants/Constants";
import { CircularProgress } from "@material-ui/core";
import ReactTable from "react-table-6";
import Messages from "../../constants/Messages";
import RegisterModal from "./register-modal";
import NotRegistersData from "./not-registers-data";
import OpenModalButton from "./open-modal-button";
import RegisterService from "../../services/RegisterService";
import Cookie from "js-cookie";
import { getRegisterColumns, getRegisterData } from "./register-table-helper";
import ModalDetail from "./modal-detail";
import DefaultForm from "./default-form";

const Setting = () => {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [registerSelected, setRegisterSelected] = useState({});
	const [blockchains, setBlockchains] = useState([]);
	const [data, setData] = useState([]);
	const [error, setError] = useState("");

	const ifNotElements = data.length === 0;

	const getRegisters = async () => {
		setLoading(true);
		const token = Cookie.get("token");
		try {
			const data_ = await RegisterService.getAll(token, {});
			setData(data_.data);
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	const getBlockchains = async () => {
		try {
			const token = Cookie.get("token");
			const blockchains_ = await RegisterService.getAllBlockchains(token);
			setBlockchains(blockchains_.data);
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		getRegisters();
		getBlockchains();
	}, []);

	const selectRegister = register => {
		setRegisterSelected(register);
		setDetailModalOpen(true);
	};

	return (
		<>
			<div className="HeadButtons">{!loading && !ifNotElements && <OpenModalButton setModalOpen={setModalOpen} />}</div>
			{(loading && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			)) ||
				(ifNotElements && <NotRegistersData setModalOpen={setModalOpen} />) || (
					<ReactTable
						sortable={false}
						previousText={Messages.LIST.TABLE.PREV}
						nextText={Messages.LIST.TABLE.NEXT}
						data={data.map(register => getRegisterData(register, selectRegister))}
						columns={getRegisterColumns}
						minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
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
			<ModalDetail modalOpen={detailModalOpen} setModalOpen={setDetailModalOpen} register={registerSelected} />
		</>
	);
};

export default Setting;
