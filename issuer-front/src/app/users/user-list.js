import { CircularProgress } from "@material-ui/core";
import MaterialIcon from "material-icons-react";
import React, { useEffect, useState } from "react";
import ReactTable from "react-table-6";
import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";
import UserService from "../../services/UserService";
import CreateUserModal from "../components/CreateUserModal";
import Cookie from "js-cookie";
import { getUserAllColumns, getUserData } from "./user-table-helper";
import { filter, filterByDates } from "../../services/utils";
import DeleteAbstractModal from "./delete-abstract-modal";
import ProfileService from "../../services/ProfileService";
import { validateAccess } from "../../constants/Roles";

const UserList = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [userSelected, setUserSelected] = useState({});
	const [openDelete, setOpenDelete] = useState(false);

	const [profiles, setProfiles] = useState([]);

	const [filters, setFilters] = useState({});
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		setError("");
		getUsersData();
		getProfilesData();
	}, []);

	useEffect(() => {
		const { name, profile, start, end } = filters;
		const result = users.filter(
			row => filter(row, "name", name) && filter(row, "profile", profile) && filterByDates(row, start, end)
		);
		setFilteredData(result);
	}, [filters]);

	const getProfilesData = async () => {
		const token = Cookie.get("token");
		const profiles = await ProfileService.getAll()(token);

		setProfiles(profiles);
	};

	const getUsersData = async () => {
		const token = Cookie.get("token");
		setLoading(true);
		try {
			const users_ = await UserService.getAll()(token);
			setUsers(users_);
			setFilteredData(users_);
			setError(null);
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	const createUser = async user => {
		const token = Cookie.get("token");
		await UserService.create(user)(token);
		await getUsersData();
	};

	const editUser = async user => {
		const token = Cookie.get("token");
		await UserService.edit(user)(token);
		await getUsersData();
	};

	const deleteUser = async () => {
		try {
			const token = Cookie.get("token");
			await UserService.delete(userSelected._id)(token);
			await getUsersData();
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

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	const onDateRangeFilterChange = ({ start, end }) => {
		setFilters(prev => ({ ...prev, start, end }));
	};

	return (
		<>
			<div className="HeadButtons">
				{validateAccess(Constants.ROLES.Write_Users) && (
					<button className="CreateButton" onClick={() => setModalOpen(true)}>
						<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
						<div className="CreateButtonText">Crear Usuario</div>
					</button>
				)}
			</div>
			{error && <div className="errMsg">{error}</div>}
			{(loading && (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			)) || (
				<ReactTable
					sortable={true}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={filteredData.map(user => getUserData(user, onDelete, onEdit))}
					columns={getUserAllColumns(onFilterChange, profiles, onDateRangeFilterChange)}
					minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
				/>
			)}
			<CreateUserModal
				title="Crear"
				open={modalOpen}
				close={() => setModalOpen(false)}
				onSubmit={createUser}
				profiles={profiles}
				required
			/>
			<CreateUserModal
				title="Editar"
				open={openEdit}
				userData={userSelected}
				close={() => setOpenEdit(false)}
				onSubmit={editUser}
				profiles={profiles}
			/>
			<DeleteAbstractModal title="Usuario" open={openDelete} setOpen={setOpenDelete} onAccept={deleteUser} />
		</>
	);
};

export default UserList;
