import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Template.scss";

import Cookie from "js-cookie";
import MaterialIcon from "material-icons-react";

import DataRenderer from "../../utils/DataRenderer";

import TemplateService from "../../../services/TemplateService";
import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

class Template extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			typingTimeout: 0,
			typing: false,
			isDialogOpen: false,
			radioValue: 1,
			options: [],
			dataType: Constants.TEMPLATES.TYPES.TEXT
		};
	}

	// cargar template
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		this.setState({ loading: true });
		TemplateService.get(
			token,
			id,
			async function(template) {
				self.setState({
					id: id,
					isDialogOpen: false,
					template: template,
					radioValue: template.previewType,
					loading: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	// volver a listado de certificados
	onBack = () => {
		this.props.history.push(Constants.ROUTES.TEMPLATES);
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// agregar campo al template con la info proveniente del dialogo
	createField = () => {
		const type = this.state.type;
		const data = {
			name: this.state.name,
			type: this.state.dataType,
			mandatory: false,
			required: this.state.required,
			options: this.state.options.length ? this.state.options : []
		};

		this.state.template.data[type].push(data);
		this.setState({ template: this.state.template, isDialogOpen: false });
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

	// seleccionar los campos a mostrarse por defecto en el certificado
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

	// abrir dialogo para insercion de campo en el template
	onDialogOpen = type =>
		this.setState({
			isDialogOpen: true,
			name: "",
			type: type,
			dataType: Constants.TEMPLATES.TYPES.TEXT,
			options: [],
			required: false
		});

	// cerrar dialogo para insercion de campo en el template
	onDialogClose = () => this.setState({ isDialogOpen: false });

	// guardar template y volver a listado de templates
	onSave = () => {
		const token = Cookie.get("token");
		const template = this.state.template;
		const self = this;

		self.setState({ loading: true });
		TemplateService.save(
			token,
			template,
			async function(_) {
				self.setState({ loading: false });
				self.props.history.push(Constants.ROUTES.LIST);
				// self.props.history.push(Constants.ROUTES.TEMPLATES);
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}
		const loading = this.state.loading;
		return (
			<div className="Template">
				{this.renderDialog()}
				{!loading && this.renderTemplateType()}
				{!loading && this.renderTemplateCategory()}
				{!loading && this.renderTemplate()}
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}

	renderDialog = () => {
		const isCheckbox = this.state.dataType === Constants.TEMPLATES.TYPES.CHECKBOX;
		return (
			<Dialog open={this.state.isDialogOpen} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle className="DialogTitle">{Messages.EDIT.DIALOG.FIELD.TITLE}</DialogTitle>
				<DialogContent>
					{this.renderDialogName()}
					{isCheckbox && this.renderDialogCheckbox()}
					{this.renderDialogTypes()}
					{this.renderDialogRequired()}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={this.createField}
						disabled={
							!this.state.name ||
							(this.state.dataType === Constants.TEMPLATES.TYPES.CHECKBOX && !this.state.options.length)
						}
						color="primary"
					>
						{Messages.EDIT.DIALOG.FIELD.CREATE}
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.EDIT.DIALOG.FIELD.CLOSE}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderDialogName = () => {
		return (
			<TextField
				autoFocus
				margin="dense"
				id="name"
				label={Messages.EDIT.DIALOG.FIELD.NAME}
				type="text"
				value={this.state.name}
				onChange={event => this.setState({ name: event.target.value })}
				fullWidth
			/>
		);
	};

	renderDialogRequired = () => {
		return (
			<div id="Required">
				<input
					className="RequiredInput"
					type="checkbox"
					onChange={event => {
						this.setState({ required: event.target.checked });
					}}
				></input>
				<div className="RequiredText">{Messages.EDIT.DIALOG.FIELD.REQUIRED}</div>
			</div>
		);
	};

	renderTemplateCategory = () => {
		const template = this.state.template;
		const categories = Constants.TEMPLATES.CATEGORIES;
		return (
			<div>
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

	renderDialogTypes = () => {
		let types = Constants.TEMPLATES.TYPES;
		if (this.state.type === Constants.TEMPLATES.DATA_TYPES.PARTICIPANT)
			types = Object.assign({}, Constants.TEMPLATES.TYPES, Constants.TEMPLATES.SHARED_TYPES);

		return (
			<div id="Types">
				<InputLabel>{Messages.EDIT.DIALOG.FIELD.TYPES}</InputLabel>
				<Select
					className={"DialogTypeDropdown"}
					autoFocus
					value={this.state.dataType}
					onChange={event => {
						if (Object.values(Constants.TEMPLATES.SHARED_TYPES).indexOf(event.target.value) >= 0) {
							const val = Object.keys(Constants.TEMPLATES.SHARED_TYPES).find(
								key => Constants.TEMPLATES.SHARED_TYPES[key] === event.target.value
							);
							this.setState({ name: val, dataType: "Text" });
						} else {
							this.setState({ name: "", dataType: event.target.value });
						}
					}}
				>
					{Object.values(types).map((type, key) => {
						return (
							<MenuItem value={type} key={"type-" + key}>
								{type}
							</MenuItem>
						);
					})}
				</Select>
			</div>
		);
	};

	renderDialogCheckbox = () => {
		return (
			<div>
				<div id="Options">
					<TextField
						autoFocus
						margin="dense"
						id="option"
						label={Messages.EDIT.DIALOG.FIELD.OPTION}
						type="text"
						onChange={event => this.setState({ option: event.target.value })}
						fullWidth
					/>

					<div
						id="OptionAdd"
						onClick={() => {
							this.state.options.push(this.state.option);
							this.setState({ options: this.state.options, option: "" });
						}}
					>
						<MaterialIcon id="AddOptionIcon" icon={Constants.TEMPLATES.EDIT.ICONS.ADD_OPTION} color={"#3f51b5"} />
					</div>
				</div>

				{this.state.options.map((op, key) => {
					return (
						<div key={"opt-" + key}>
							{op}

							<MaterialIcon
								id="DeleteIcon"
								icon={Constants.TEMPLATES.EDIT.ICONS.REMOVE_OPTION}
								color={"rgb(235, 70, 70)"}
								onClick={() => {
									this.state.options.splice(key, 1);
									this.setState({ options: this.state.options, option: "" });
								}}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	renderTemplateType = () => {
		const template = this.state.template;
		const templateElements = template.data.cert
			.concat(template.data.others)
			.concat(template.data.participant)
			.filter(elemData => elemData.required)
			.map(elementData => elementData.name);

		const missing =
			Constants.TEMPLATES.PREVIEW_ELEMS_LENGTH[this.state.radioValue] - this.state.template.previewData.length;
		const radioValue = this.state.radioValue;

		return (
			<div className="Template-Type">
				<h2 className="DataTitle">{Messages.EDIT.DATA.PREVIEW}</h2>

				<RadioGroup
					className="PreviewFieldTypePicker"
					aria-label="gender"
					name="gender1"
					value={this.state.radioValue}
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

				{missing > 0 && <div>Seleccione {missing} mas</div>}
				{missing < 0 && <div>Agrego de mas, quite {-1 * missing}</div>}
			</div>
		);
	};

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
								{DataRenderer.renderRequired(dataElem, type, this.toggleRequired, true)}
								{DataRenderer.renderDelete(dataElem, type, this.deleteField, true)}
							</div>
						</div>
					);
				})}
				{this.renderSectionButtons(type)}
			</div>
		);
	};

	renderSectionButtons = type => {
		return (
			<div className="SectionButtons">
				<button
					className="AddButton"
					onClick={() => {
						this.onDialogOpen(type);
					}}
				>
					<div className="AddButton">
						<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
						<div className="AddButtonText">{Messages.EDIT.BUTTONS.CREATE}</div>
					</div>
				</button>
			</div>
		);
	};

	renderButtons = () => {
		return (
			<div className="TemplateButtons">
				<button className="SaveButton" onClick={this.onSave}>
					{Messages.EDIT.BUTTONS.SAVE}
				</button>
				<button className="BackButton" onClick={this.onBack}>
					{Messages.EDIT.BUTTONS.BACK}
				</button>
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};
}

export default withRouter(Template);
