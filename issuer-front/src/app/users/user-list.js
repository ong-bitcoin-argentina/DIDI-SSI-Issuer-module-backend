import { CircularProgress } from "@material-ui/core";
import MaterialIcon from "material-icons-react";
import React, { useEffect, useState } from "react";
import ReactTable from "react-table-6";
import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";
import CreateUserModal from "../components/CreateUserModal";
import Spinner from "../utils/Spinner";
import { getUserColumns, getUserData } from "./user-table-helper";

const MOCK_DATA = [
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	},
	{
		name: "Uriel",
		type: "Admin",
		onCreated: new Date()
	}
];

const UserList = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	const getUsersData = async () => {
		setLoading(true);
		setUsers(MOCK_DATA);
		setLoading(false);
	};

	useEffect(() => {
		setError("");
		getUsersData();
	}, []);

	const onDelete = user => {
		try {
			console.log(user);
			//delete
			getUsersData();
			setError("");
		} catch (error) {
			setError(error.message);
		}
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
					data={users.map(user => getUserData(user, onDelete))}
					columns={getUserColumns}
					minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
				/>
			)}
			{error && <div className="errMsg">{error}</div>}
			<CreateUserModal open={modalOpen} close={() => setModalOpen(false)} onSuccess={getUsersData} />
		</>
	);
};

export default UserList;
