import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Template.css";

import Cookie from "js-cookie";
import MaterialIcon from "material-icons-react";

import ApiService from "../../../services/ApiService";
import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import NumericInput from "react-numeric-input";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

class Template extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			typingTimeout: 0,
			typing: false,
			isDialogOpen: false,
			options: [],
			dataType: Constants.TEMPLATES.TYPES.TEXT
		};
	}

	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		this.setState({ loading: true });
		ApiService.getTemplate(
			token,
			id,
			async function(template) {
				self.setState({ id: id, isDialogOpen: false, template: template, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	onBack = () => {
		this.props.history.push(Constants.ROUTES.TEMPLATES);
	};

	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	createField = () => {
		const token = Cookie.get("token");
		const self = this;
		const id = this.state.id;
		const type = this.state.type;
		const data = {
			name: this.state.name,
			type: this.state.dataType,
			required: this.state.required,
			options: this.state.options
		};

		this.setState({ loading: true });
		ApiService.createTemplateField(
			token,
			id,
			data,
			type,
			async function(template) {
				self.setState({ template: template, loading: false, isDialogOpen: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	toggleRequired = (data, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		this.setState({ loading: true });
		ApiService.toggleRequiredForTemplateField(
			token,
			id,
			data,
			type,
			async function(template) {
				self.setState({ template: template, loading: false, isDialogOpen: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	defaultValueChanged = (data, defaultValue, type) => {
		const self = this;
		if (self.state.typingTimeout) {
			clearTimeout(self.state.typingTimeout);
		}

		data.defaultValue = defaultValue;

		self.setState({
			typing: false,
			typingTimeout: setTimeout(function() {
				self.setDefaultValue(data, defaultValue, type);
			}, Constants.TEMPLATES.EDIT.TYPING_TIMEOUT)
		});
	};

	setDefaultValue = (data, defaultValue, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		this.setState({ loading: true });
		ApiService.setTemplateDefaultField(
			token,
			id,
			data,
			defaultValue,
			type,
			async function(template) {
				self.setState({ template: template, loading: false, isDialogOpen: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	deleteField = (data, type) => {
		const id = this.state.id;
		const token = Cookie.get("token");
		const self = this;

		this.setState({ loading: true });
		ApiService.deleteTemplateField(
			token,
			id,
			data,
			type,
			async function(template) {
				self.setState({ template: template, loading: false, isDialogOpen: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onDialogOpen = type =>
		this.setState({
			isDialogOpen: true,
			name: "",
			type: type,
			dataType: Constants.TEMPLATES.TYPES.TEXT,
			options: [],
			required: false
		});
	onDialogClose = () => this.setState({ isDialogOpen: false });

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}
		const loading = this.state.loading;
		return (
			<div className="Template">
				{this.renderDialog()}
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
				<DialogTitle id="DialogTitle">{Messages.EDIT.DIALOG.TITLE}</DialogTitle>
				<DialogContent>
					{this.renderDialogName()}
					{isCheckbox && this.renderDialogCheckbox()}
					{this.renderDialogTypes()}
					{this.renderDialogRequired()}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.createField} color="primary">
						{Messages.EDIT.DIALOG.CREATE}
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.EDIT.DIALOG.CLOSE}
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
				label={Messages.EDIT.DIALOG.NAME}
				type="text"
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
				<div className="RequiredText">{Messages.EDIT.DIALOG.REQUIRED}</div>
			</div>
		);
	};

	renderDialogTypes = () => {
		return (
			<div id="Types">
				<InputLabel>{Messages.EDIT.DIALOG.TYPES}</InputLabel>
				<Select
					className={"DialogTypeDropdown"}
					autoFocus
					value={this.state.dataType}
					onChange={event => {
						this.setState({ dataType: event.target.value });
					}}
				>
					{Object.values(Constants.TEMPLATES.TYPES).map((type, key) => {
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
						label={Messages.EDIT.DIALOG.OPTION}
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

	renderTemplate = () => {
		const template = this.state.template;
		const nameData = { name: "name", defaultValue: this.state.template.name, required: true, mandatory: true };
		return (
			<div className="Template-Content">
				{this.renderSection(
					Messages.EDIT.DATA.CERT,
					[nameData, ...template.data.cert],
					Constants.TEMPLATES.DATA_TYPES.CERT
				)}
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
				<h2>{title}</h2>
				{data.map((dataElem, index) => {
					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="DataName">{dataElem.name}</div>
							<div className="DataElem">
								{this.renderSectionDefaultValue(dataElem, type)}
								{this.renderSectionRequired(dataElem, type)}
								{this.renderSectionDelete(dataElem, type)}
							</div>
						</div>
					);
				})}
				{this.renderSectionButtons(type)}
			</div>
		);
	};

	renderSectionDefaultValue = (dataElem, type) => {
		if (dataElem.mandatory)
			return <div className="DataDefault DataDefaultInput Mandatory">{dataElem.defaultValue}</div>;

		switch (dataElem.type) {
			case Constants.TEMPLATES.TYPES.BOOLEAN:
				return (
					<Select
						className="DataDefault DataDefaultInput Boolean"
						autoFocus
						value={dataElem.defaultValue}
						onChange={event => {
							this.setDefaultValue(dataElem, event.target.value, type);
						}}
					>
						<MenuItem className="DataDefaultInput" value={"true"}>
							{Constants.TEMPLATES.EDIT.BOOLEAN.TRUE}
						</MenuItem>
						<MenuItem className="DataDefaultInput" value={"false"}>
							{Constants.TEMPLATES.EDIT.BOOLEAN.FALSE}
						</MenuItem>
					</Select>
				);
			case Constants.TEMPLATES.TYPES.CHECKBOX:
				return (
					<Select
						className="DataDefault DataDefaultInput Boolean"
						autoFocus
						value={dataElem.defaultValue ? dataElem.defaultValue : dataElem.options[0]}
						onChange={event => {
							this.setDefaultValue(dataElem, event.target.value, type);
						}}
					>
						{dataElem.options.map((opt, key) => {
							return (
								<MenuItem value={opt} key={"option-" + key} className="DataDefaultInput">
									{opt}
								</MenuItem>
							);
						})}
					</Select>
				);
			case Constants.TEMPLATES.TYPES.DATE:
				return (
					<DatePicker
						className="DataDefault DataDefaultInput"
						selected={dataElem.defaultValue ? new Date(dataElem.defaultValue) : new Date()}
						onChange={date => {
							date = dateFormat(date, "yyyy-mm-dd hh:MM:ss");
							this.setDefaultValue(dataElem, date.replace(" ", "T") + "Z", type);
						}}
						dateFormat="dd-MM-yyyy"
					/>
				);
			case Constants.TEMPLATES.TYPES.NUMBER:
				return (
					<NumericInput
						className="DataDefault DataDefaultInput Number"
						value={dataElem.defaultValue}
						onChange={value => {
							this.defaultValueChanged(dataElem, value, type);
						}}
					/>
				);
			case Constants.TEMPLATES.TYPES.PARAGRAPH:
				return (
					<textarea
						className="DataDefault DataDefaultInput Paragraph"
						value={dataElem.defaultValue}
						onChange={event => {
							this.defaultValueChanged(dataElem, event.target.value, type);
						}}
					/>
				);
			case Constants.TEMPLATES.TYPES.TEXT:
			default:
				return (
					<input
						type="text"
						className="DataDefault DataDefaultInput"
						value={dataElem.defaultValue}
						onChange={event => {
							this.defaultValueChanged(dataElem, event.target.value, type);
						}}
					/>
				);
		}
	};

	renderSectionDelete = (dataElem, type) => {
		if (dataElem.mandatory) return <div></div>;

		return (
			<div
				className="DataDelete"
				onClick={() => {
					this.deleteField(dataElem, type);
				}}
			>
				<MaterialIcon icon={Constants.TEMPLATES.EDIT.ICONS.DELETE} color="#eb4646" />
				<div>{Messages.EDIT.BUTTONS.DELETE}</div>
			</div>
		);
	};

	renderSectionRequired = (dataElem, type) => {
		const icon = dataElem.required
			? Constants.TEMPLATES.EDIT.ICONS.REQUIRED
			: Constants.TEMPLATES.EDIT.ICONS.NOT_REQUIRED;
		return (
			<div
				className="DataRequired"
				onClick={() => {
					this.toggleRequired(dataElem, type);
				}}
			>
				<MaterialIcon icon={icon} color="#bdbfbe" />
				<div>{Messages.EDIT.BUTTONS.REQUIRED}</div>
			</div>
		);
	};

	renderSectionButtons = type => {
		return (
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
		);
	};

	renderButtons = () => {
		return (
			<div className="Template-Buttons">
				<button className="backButton" onClick={this.onBack}>
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
