import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ReactTable from "react-table-6";
import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";
import OpenModalButton from "../setting/open-modal-button";
import ProfileModal from "./profile-modal";
import { getProfileAllColumns, getProfileData } from "./profile-table-helper";
import Cookie from "js-cookie";
import ProfileService from "../../services/ProfileService";
import { filter } from "../../services/utils";

const token = Cookie.get("token");

const { PREV, NEXT } = Messages.LIST.TABLE;
const { MIN_ROWS } = Constants.CERTIFICATES.TABLE;

const BUTTON_MODAL_NAME = "Nuevo Perfil";
const TITLE = "Perfiles";
const DESCRIPTION = "Crea perfiles asignando distintos tipos de permisos";

const Profile = () => {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [profiles, setProfiles] = useState([]);
	const [profileSelected, setProfileSelected] = useState({});
	const [error, setError] = useState("");

	const [filters, setFilters] = useState({});
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		getProfilesData();
	}, []);

	useEffect(() => {
		const { name } = filters;
		const result = profiles.filter(row => filter(row, "name", name));
		setFilteredData(result);
	}, [filters]);

	const handle = async next => {
		try {
			await next();
			setError("");
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	const getProfilesData = () =>
		handle(async () => {
			setLoading(true);
			const profiles = await ProfileService.getAll()(token);

			setProfiles(profiles);
			setFilteredData(profiles);
		});

	const createProfile = newProfile =>
		handle(async () => {
			await ProfileService.create(newProfile)(token);
			await getProfilesData();
		});

	const editProfile = ({ _id, ...rest }) =>
		handle(async () => {
			await ProfileService.edit(_id, rest)(token);
			await getProfilesData();
		});

	const onEdit = profile => {
		setProfileSelected(profile);
		setEditModalOpen(true);
	};

	const onDelete = async id =>
		handle(async () => {
			await ProfileService.delete(id)(token);
			await getProfilesData();
		});

	const onFilterChange = (e, key) => {
		const val = e.target.value;
		setFilters(prev => ({ ...prev, [key]: val }));
	};

	return (
		<>
			{(!loading && (
				<>
					<Grid container xs={12} style={{ margin: "10px 0" }}>
						<Grid item xs={8} container direction="column" style={{ textAlign: "start" }}>
							<h1 style={{ margin: "0", padding: "0" }}>{TITLE}</h1>
							<p>{DESCRIPTION}</p>
						</Grid>
						<Grid item xs={4} container justify="flex-end" alignItems="center">
							<OpenModalButton setModalOpen={setModalOpen} title={BUTTON_MODAL_NAME} />
						</Grid>
					</Grid>
					<ReactTable
						sortable
						previousText={PREV}
						columns={getProfileAllColumns(onFilterChange)}
						minRows={MIN_ROWS}
						pageSize={5}
						nextText={NEXT}
						data={filteredData.map(profile => getProfileData(profile, onEdit, onDelete))}
					/>
				</>
			)) || (
				<div style={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</div>
			)}
			<ProfileModal title="Crear" open={modalOpen} close={() => setModalOpen(false)} onSubmit={createProfile} />
			<ProfileModal
				title="Editar"
				open={editModalOpen}
				close={() => setEditModalOpen(false)}
				onSubmit={editProfile}
				profileData={profileSelected}
			/>
			{error && (
				<div className="errMsg" style={{ width: "100%" }}>
					{error}
				</div>
			)}
		</>
	);
};

export default Profile;
