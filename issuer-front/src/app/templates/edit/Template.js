import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Template.css";

import Cookie from "js-cookie";
import MaterialIcon from "material-icons-react";

import ApiService from "../../../services/ApiService";
import Constants from "../../../constants/Constants";

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
				<DialogTitle id="DialogTitle">Crear Modelo</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Nombre"
						type="text"
						onChange={event => this.setState({ name: event.target.value })}
						fullWidth
					/>

					{isCheckbox && (
						<div id="Options">
							<TextField
								autoFocus
								margin="dense"
								id="option"
								label="Opcion"
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
					)}

					{isCheckbox &&
						this.state.options.map((op, key) => {
							return (
								<div key={"opt-" + key}>
									{op}

									<MaterialIcon
										id="DeleteIcon"
										icon={Constants.TEMPLATES.EDIT.ICONS.REMOVE_OPTION}
										color={"rgb(235, 70, 70)"}
										onClick={() => {
											console.log(op);
											const endOpt = this.state.options.filter(opt => opt !== op);
											this.setState({ options: endOpt, option: "" });
										}}
									/>
								</div>
							);
						})}

					<div id="Types">
						<InputLabel>Types</InputLabel>
						<Select
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

					<div id="Required">
						<input
							className="RequiredInput"
							type="checkbox"
							onChange={event => {
								this.setState({ required: event.target.checked });
							}}
						></input>
						<div className="RequiredText">Requerido</div>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.createField} color="primary">
						Crear
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderTemplate = () => {
		const template = this.state.template;
		const nameData = { name: "name", defaultValue: this.state.template.name, required: true, mandatory: true };
		return (
			<div className="Template-Content">
				{this.renderSection(
					"DATOS DEL CERTIFICADO",
					[nameData, ...template.data.cert],
					Constants.TEMPLATES.DATA_TYPES.CERT
				)}
				{this.renderSection(
					"DATOS DEL PARTICIPANTE",
					template.data.participant,
					Constants.TEMPLATES.DATA_TYPES.PARTICIPANT
				)}
				{this.renderSection("OTROS DATOS", template.data.others, Constants.TEMPLATES.DATA_TYPES.OTHERS)}
			</div>
		);
	};

	renderSection = (title, data, type) => {
		return (
			<div className="Template-Section-Content">
				<h2>{title}</h2>
				{data.map((dataElem, index) => {
					const icon = dataElem.required
						? Constants.TEMPLATES.EDIT.ICONS.REQUIRED
						: Constants.TEMPLATES.EDIT.ICONS.NOT_REQUIRED;
					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="Data-Name">{dataElem.name}</div>
							<div className="Data-Elem">
								<div className="Data-Default">{dataElem.defaultValue}</div>
								<div className="Data-Required">
									<MaterialIcon icon={icon} color="#bdbfbe" />
									<div>{"Requerido"}</div>
								</div>

								{!dataElem.mandatory && (
									<div
										className="Data-Delete"
										onClick={() => {
											this.deleteField(dataElem, type);
										}}
									>
										<MaterialIcon icon={Constants.TEMPLATES.EDIT.ICONS.DELETE} color="#eb4646" />
										<div>{"Delete"}</div>
									</div>
								)}
							</div>
						</div>
					);
				})}
				<button
					className="addButton"
					onClick={() => {
						this.onDialogOpen(type);
					}}
				>
					<div className="addButton">
						<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
						<div className="addButtonText">NUEVO CAMPO</div>
					</div>
				</button>
			</div>
		);
	};

	renderButtons = () => {
		return (
			<div className="Template-Buttons">
				<button className="backButton" onClick={this.onBack}>
					Volver
				</button>
				<button className="logoutButton" onClick={this.onLogout}>
					Salir
				</button>
			</div>
		);
	};
}

export default withRouter(Template);
