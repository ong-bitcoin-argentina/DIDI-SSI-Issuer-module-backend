import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Template.scss";

import Cookie from "js-cookie";
import MaterialIcon from "material-icons-react";

import Spinner from "../../utils/Spinner";
import DataRenderer from "../../utils/DataRenderer";
import TemplateFieldAddDialog from "../../utils/dialogs/TemplateFieldAddDialog";

import TemplateService from "../../../services/TemplateService";
import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import logoApp from "../../../images/ai-di-logo.svg";
import Header from "../../components/Header";
import RegisterService from "../../../services/RegisterService";
import BlockchainName from "../../utils/dialogs/blockchainName";

class Template extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			typingTimeout: 0,
			typing: false,
			radioValue: 1
		};
	}

	// cargar modelo de credencial
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		this.setState({ loading: true });
		TemplateService.get(
			token,
			id,
			async function (template) {
				self.setState({
					id: id,
					template: template,
					radioValue: template.previewType,
					loading: false,
					error: false
				});
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);

		RegisterService.getAll(token)
			.then(response => this.setState({ registers: response.data }))
			.catch(error => self.setState({ error }));
	}

	// volver a listado
	onBack = () => {
		if (this.state.loading && this.state.error) {
			this.setState({ loading: false, error: false });
		} else {
			this.props.history.push(Constants.ROUTES.TEMPLATES);
		}
	};

	// agregar campo al template con la info proveniente del dialogo
	createField = (data, type) => {
		if (this.templateFieldAddDialog) this.templateFieldAddDialog.close();

		this.state.template.data[type].push(data);
		this.setState({ template: this.state.template });
	};

	// marcar campo como requerido / no requerido
	toggleRequired = (data, type) => {
		const dataElem = this.state.template.data[type].find(dataElem => {
			return dataElem.name === data.name;
		});

		if (dataElem && !dataElem.mandatory) {
			dataElem.required = !dataElem.required;
			this.setState({ template: this.state.template });
		}
	};

	// cambiar valor por defecto del campo
	setDefaultValue = (data, defaultValue, type) => {
		const dataElem = this.state.template.data[type].find(dataElem => {
			return dataElem.name === data.name;
		});

		if (dataElem) {
			dataElem.defaultValue = defaultValue;
			this.setState({ template: this.state.template });
		}
	};

	// seleccionar los campos a mostrarse por defecto en el credencial
	onPreviewFieldsSelected = event => {
		const template = this.state.template;
		template.previewData = event.target.value;
		template.previewType = this.state.radioValue;
		this.setState({ template: template });
	};

	// borrar campo
	deleteField = (data, type) => {
		const template = this.state.template;
		template.data[type] = template.data[type].filter(dataElem => {
			return dataElem.name !== data.name;
		});
		template.previewData = template.previewData.filter(prevData => {
			return prevData !== data.name;
		});
		this.setState({ template: template });
	};

	// guardar template y volver a listado de templates
	onSave = () => {
		const token = Cookie.get("token");
		const template = this.state.template;
		template.previewType = this.state.radioValue;
		const self = this;

		self.setState({ loading: true });
		TemplateService.save(
			token,
			template,
			async function (_) {
				self.setState({ loading: false, error: false });
				self.props.history.push(Constants.ROUTES.LIST);
				// self.props.history.push(Constants.ROUTES.TEMPLATES);
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	renderBlockchainRegister = () => {
		const { template, registers } = this.state;
		const { registerId } = template;
		return (
			<div className="Template-Type">
				<h2 className="DataTitle">{Messages.EDIT.DATA.EMISOR}</h2>
				<Select
					className="CategoriesPicker"
					displayEmpty
					value={registerId ? registerId : ""}
					onChange={event => {
						template.registerId = event.target.value;
						this.setState({ template: template });
					}}
				>
					{(registers || []).map(({ name, did, _id }) => {
						return (
							<MenuItem key={_id} value={_id}>
								{name} <BlockchainName did={did} />
							</MenuItem>
						);
					})}
				</Select>
			</div>
		);
	};

	// mostrar pantalla de edicion de modelos de credenciales
	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}
		const loading = this.state.loading;
		return (
			<div className={`${loading && "Loading"} Template mb-2`}>
				<Header />

				{Spinner.render(loading)}
				{this.renderDialog()}
				<div className="container">
					{!loading && this.renderTemplateCategory()}
					{!loading && this.renderBlockchainRegister()}
					{!loading && this.renderTemplate()}
					{!loading && this.renderTemplateType()}
					{this.renderButtons()}
					{this.state.error && <div className="errMsg">{this.state.error.message}</div>}
				</div>
			</div>
		);
	}

	// mostrar dialogo para agregar o eliminar campos del modelo
	renderDialog = () => {
		return (
			<TemplateFieldAddDialog
				onRef={ref => (this.templateFieldAddDialog = ref)}
				title={Messages.EDIT.DIALOG.FIELD.TITLE}
				onAccept={this.createField}
			/>
		);
	};

	// mostrar controles para definir la categoria del modelo
	// (como se categorizara al credencial en la app Android)
	renderTemplateCategory = () => {
		const template = this.state.template;
		const categories = Constants.TEMPLATES.CATEGORIES;
		return (
			<div className="Template-Type">
				<h2 className="DataTitle">{Messages.EDIT.DATA.CATEGORIES}</h2>
				<Select
					className="CategoriesPicker"
					displayEmpty
					value={template.category ? template.category : ""}
					onChange={event => {
						template.category = event.target.value;
						this.setState({ template: template });
					}}
					renderValue={selected => selected}
				>
					{categories.map((elem, key) => {
						return (
							<MenuItem key={"Category-" + key} value={elem}>
								<ListItemText primary={elem} />
							</MenuItem>
						);
					})}
				</Select>
			</div>
		);
	};

	// mostrar controles para definir como se mostrara la credencial en la app Android
	// (cuantos campos se mostraran por defecto y cuales son esos campos)
	renderTemplateType = () => {
		const template = this.state.template;
		const templateElements = template.data.cert
			.concat(template.data.others)
			.concat(template.data.participant)
			.filter(elemData => elemData.required)
			.map(elementData => elementData.name);

		const radioValue = this.state.radioValue;
		const missing = Constants.TEMPLATES.PREVIEW_ELEMS_LENGTH[radioValue] - this.state.template.previewData.length;

		return (
			<div className="Template-Type mb-2">
				<h2 className="DataTitle">{Messages.EDIT.DATA.PREVIEW}</h2>
				<div className="templateTypeCard">
					<RadioGroup
						className="PreviewFieldTypePicker"
						aria-label="gender"
						name="gender1"
						value={radioValue}
						onChange={event => {
							this.setState({ radioValue: event.target.value });
						}}
					>
						<div className="PreviewFieldItem">
							<FormControlLabel value="1" checked={radioValue === "1"} control={<Radio />} />
							<img src={require("./Preview/1.png")} className="PreviewFieldTypeImage" alt="type 1" />
						</div>

						<div className="PreviewFieldItem">
							<FormControlLabel value="2" checked={radioValue === "2"} control={<Radio />} />
							<img src={require("./Preview/2.png")} className="PreviewFieldTypeImage" alt="type 2" />
						</div>

						<div className="PreviewFieldItem">
							<FormControlLabel value="3" checked={radioValue === "3"} control={<Radio />} />
							<img src={require("./Preview/3.png")} className="PreviewFieldTypeImage" alt="type 3" />
						</div>
					</RadioGroup>
				</div>
				<div className="selectContainer">
					<Select
						className="PreviewFieldsSelect"
						multiple
						displayEmpty
						value={this.state.template.previewData}
						onChange={this.onPreviewFieldsSelected}
						renderValue={selected => selected.join(", ")}
					>
						{templateElements.map((elem, key) => {
							return (
								<MenuItem key={"PreviewFields-" + key} value={elem}>
									<Checkbox checked={this.state.template.previewData.indexOf(elem) > -1} />
									<ListItemText primary={elem} />
								</MenuItem>
							);
						})}
					</Select>
				</div>
				{missing !== 0 && (
					<div className="errorMessage">
						{missing > 0 && <div>Seleccione {missing} mas</div>}
						{missing < 0 && <div>Agrego de mas, quite {-1 * missing}</div>}
					</div>
				)}
			</div>
		);
	};

	// mostrar la lista de campos con sus valores por defecto categorizados en:
	// Datos de la credencial
	// Datos del participante
	// Otros datos
	renderTemplate = () => {
		const template = this.state.template;
		return (
			<div className="Template-Content">
				{this.renderSection(Messages.EDIT.DATA.CERT, template.data.cert, Constants.TEMPLATES.DATA_TYPES.CERT)}
				{this.renderSection(
					Messages.EDIT.DATA.PART,
					template.data.participant,
					Constants.TEMPLATES.DATA_TYPES.PARTICIPANT
				)}
				{this.renderSection(Messages.EDIT.DATA.OTHER, template.data.others, Constants.TEMPLATES.DATA_TYPES.OTHERS)}
			</div>
		);
	};

	// mostrar la lista de campos con sus valores por defecto para una categoria en particular
	renderSection = (title, data, type) => {
		return (
			<div className="TemplateSectionContent">
				<h2 className="DataTitle">{title}</h2>
				{data.map((dataElem, index) => {
					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="DataName">{dataElem.name}</div>

							<div className="DataElem">
								{DataRenderer.renderData(dataElem, type, true, this.setDefaultValue, true)}
								<div className="options">
									{DataRenderer.renderRequired(dataElem, type, this.toggleRequired, true)}
									{DataRenderer.renderDelete(dataElem, type, this.deleteField, true)}
								</div>
							</div>
						</div>
					);
				})}
				{this.renderSectionButtons(type)}
			</div>
		);
	};

	// mostrar controles para agregar un campo nuevo en la seccion elegida
	// (Datos de la credencial, Datos del participante, Otros datos)
	renderSectionButtons = type => {
		return (
			<div className="SectionButtons">
				<button
					className="AddButton"
					onClick={() => {
						if (this.templateFieldAddDialog) this.templateFieldAddDialog.open(type);
					}}
				>
					<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
					<div className="AddButtonText">{Messages.EDIT.BUTTONS.CREATE}</div>
				</button>
			</div>
		);
	};

	// mostrar botones al pie de la tabla
	renderButtons = () => {
		const role = Cookie.get("role");
		return (
			<div className="TemplateButtons">
				{role !== Constants.ROLES.Observer && (
					<button className="SaveButton" onClick={this.onSave}>
						{Messages.EDIT.BUTTONS.SAVE}
					</button>
				)}
				<button className="BackButton" onClick={this.onBack}>
					{Messages.EDIT.BUTTONS.BACK}
				</button>
			</div>
		);
	};
}

export default withRouter(Template);
