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
import { getRegisterColumns, getRegisterData } from "./register-table-helper";
import ModalDetail from "./modal-detail";
import DefaultForm from "./default-form";
import EditRegisterModal from "./edit-register-modal";

const Setting = () => {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
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

	const selectRegister = setModalFn => register => {
		setRegisterSelected(register);
		setModalFn(true);
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
						data={data.map(register =>
							getRegisterData(register, selectRegister(setDetailModalOpen), selectRegister(setEditModalOpen))
						)}
						columns={getRegisterColumns}
						minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
						pageSize={5}
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
