import { CircularProgress } from "@material-ui/core";
import MaterialIcon from "material-icons-react";
import React, { useEffect, useState } from "react";
import ReactTable from "react-table-6";
import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";
import UserService from "../../services/UserService";
import CreateUserModal from "../components/CreateUserModal";
import Cookie from "js-cookie";
import { getUserColumns, getUserData } from "./user-table-helper";
import UserDeleteModal from "./user-delete-modal";

const UserList = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [userSelected, setUserSelected] = useState({});
	const [openDelete, setOpenDelete] = useState(false);

	useEffect(() => {
		setError("");
		getUsersData();
	}, []);

	const getUsersData = async () => {
		const token = Cookie.get("token");
		setLoading(true);
		try {
			const users_ = await UserService.getAll(token);
			setUsers(users_.data);
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	const createUser = async user => {
		try {
			const token = Cookie.get("token");
			await UserService.create(token, user);
			await getUsersData();
		} catch (error) {
			setError(error.message);
		}
	};

	const deleteUser = async () => {
		try {
			const token = Cookie.get("token");
			await UserService.delete(token, userSelected._id);
			await getUsersData();
			setError("");
			setUserSelected({});
			setOpenDelete(false);
		} catch (error) {
			setError(error.message);
		}
	};

	const onDelete = user => {
		setOpenDelete(true);
		setUserSelected(user);
	};

	const onEdit = user => {
		setUserSelected(user);
		setOpenEdit(true);
	};

	return (
		<>
			<div className="HeadButtons">
				<button className="CreateButton" onClick={() => setModalOpen(true)}>
					<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
					<div className="CreateButtonText">Crear Usuario</div>
				</button>
			</div>
			{(loading && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			)) || (
				<ReactTable
					sortable={false}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={users.map(user => getUserData(user, onDelete, onEdit))}
					columns={getUserColumns}
					minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
				/>
			)}
			{error && <div className="errMsg">{error}</div>}
			<CreateUserModal title="Crear" open={modalOpen} close={() => setModalOpen(false)} onSubmit={createUser} />
			<CreateUserModal
				title="Editar"
				open={openEdit}
				userData={userSelected}
				close={() => setOpenEdit(false)}
				onSubmit={() => {}}
			/>
			<UserDeleteModal open={openDelete} setOpen={setOpenDelete} onAccept={deleteUser} />
		</>
	);
};

export default UserList;
