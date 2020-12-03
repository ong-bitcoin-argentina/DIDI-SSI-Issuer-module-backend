import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import TemplateService from "../../services/TemplateService";
import DefaultButton from "./default-button";
import Cookie from "js-cookie";
import SelectDefaultInput from "../../services/SelectDefaultInput";
import DefautValueService from "../../services/DefaultValueService";
import { Alert } from "@material-ui/lab";
import Notification from "../components/Notification";
import RegisterService from "../../services/RegisterService";
import Constants from "../../constants/Constants";

const BLOCKCHAIN_LABEL_NAME = "Blockchain de Verificación por defecto";
const TEMPALTE_LABEL_NAME = "Template de Credenciales por defecto";
const CREATE_MESSAGE = "Se creo exitosamente";
const EDIT_MESSAGE = "Se edito exitosamente";

const DefaultForm = () => {
	const [defaultValue, setDefaultValue] = useState({});
	const [prevDefaultValue, setPrevDefaultValue] = useState({});

	const [templates, setTemplates] = useState([]);
	const [registers, setRegisters] = useState([]);

	const [error, setError] = useState("");
	const [existDefault, setExistDefault] = useState(false);

	const [notificationOpens, setNotificationsOpens] = useState({ create: false, edit: false });

	// Loadings
	const [loading, setLoading] = useState({
		templateLoading: false,
		defaultvalueLoading: false,
		registerLoading: false
	});

	const token = Cookie.get("token");

	const { templateLoading, defaultvalueLoading, registerLoading } = loading;
	const { create, edit } = notificationOpens;

	useEffect(() => {
		getTemplatesData();
		getDefaultValueData();
		getRegisterData();
	}, []);

	const getDefaultValueData = async () => {
		setLoading(l => ({ ...l, defaultvalueLoading: true }));
		const { data } = await DefautValueService.get(token);
		if (data) {
			const { templateId, registerId } = data;
			setDefaultValue({ templateId, registerId });
			setPrevDefaultValue({ templateId, registerId });
			setExistDefault(true);
		} else {
			setExistDefault(false);
		}
		setLoading(l => ({ ...l, defaultvalueLoading: false }));
	};

	const getData = async (loadingName, setData, fetch_) => {
		setLoading(l => ({ ...l, [loadingName]: true }));
		const { data } = await fetch_();
		setLoading(l => ({ ...l, [loadingName]: false }));
		setData(data);
	};

	const getTemplatesData = () => {
		getData("templateLoading", setTemplates, async () => await TemplateService.getAllAsync(token));
	};

	const getRegisterData = async () => {
		getData(
			"registerLoading",
			setRegisters,
			async () => await RegisterService.getAll(token, { status: Constants.STATUS.DONE })
		);
	};

	const handleError = async (fetch_, next) => {
		try {
			const { templateId, registerId } = prevDefaultValue;
			const { templateId: templateId_, registerId: registerId_ } = defaultValue;

			if (templateId === templateId_ && registerId === registerId_) return;

			const { status, data } = await fetch_(token, defaultValue);

			if (status === "error") {
				setError(data.message);
				return;
			}
			setError("");
			setPrevDefaultValue(defaultValue);
			next();
		} catch (error) {
			setError(error.response.data);
		}
	};

	const createDefaultValue = () =>
		handleError(DefautValueService.create, () => {
			changeNotification("create", true)();
			setExistDefault(true);
		});

	const editDefaultFunction = () => handleError(DefautValueService.edit, changeNotification("edit", true));

	const parseRegisterData = ({ name, did }) => `${name}  (${did.split(":")[2].toUpperCase()})`;
	const parseTemplateData = ({ name, blockchain }) => name + (blockchain ? ` (${blockchain.toUpperCase()})` : "");

	const handleChange = event => {
		const { value, name } = event.target;
		setDefaultValue(v => ({ ...v, [name]: value }));
	};

	const changeNotification = (name, value) => () => {
		setNotificationsOpens(n => ({ ...n, [name]: value }));
	};

	return (
		<Grid container style={{ margin: "25px 0" }}>
			<Grid item xs={12} style={{ background: "#dddee5" }}>
				<Typography style={{ color: "#8f92a9", padding: "15px 15px 15px" }}>Configuraciones por Defecto</Typography>
			</Grid>

			<Grid item xs={12} container justify="center" style={{ marginTop: "50px" }}>
				<Grid item xs={6}>
					{!defaultvalueLoading && (
						<>
							{registers.length !== 0 && (
								<SelectDefaultInput
									onChange={handleChange}
									options={registers}
									loading={registerLoading}
									parseData={parseRegisterData}
									label={BLOCKCHAIN_LABEL_NAME}
									name="registerId"
									value={defaultValue}
								/>
							)}
							<SelectDefaultInput
								value={defaultValue}
								name="templateId"
								onChange={handleChange}
								parseData={parseTemplateData}
								options={templates}
								loading={templateLoading}
								label={TEMPALTE_LABEL_NAME}
							/>
							{error && <Alert color="error">{error}</Alert>}
							<Grid item xs={12} style={{ margin: "25px 0 15px" }}>
								{existDefault ? (
									<DefaultButton funct={editDefaultFunction} name="Guardar Cambios" {...loading} />
								) : (
									<DefaultButton funct={createDefaultValue} name="Crear" {...loading} />
								)}
							</Grid>
						</>
					)}
				</Grid>
			</Grid>
			<Notification message={CREATE_MESSAGE} open={create} onClose={changeNotification("create", false)} />
			<Notification message={EDIT_MESSAGE} open={edit} onClose={changeNotification("edit", false)} />
		</Grid>
	);
};

export default DefaultForm;
