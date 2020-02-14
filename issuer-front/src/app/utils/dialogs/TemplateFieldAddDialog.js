import React, { Component } from "react";
import "./TemplateFieldAddDialog.scss";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import MaterialIcon from "material-icons-react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

export default class TemplateFieldAddDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			name: "",
			options: [],
			dataType: Constants.TEMPLATES.TYPES.TEXT,
			required: false
		};
	}

	// generar referencia para abrirlo desde el padre
	componentDidMount() {
		this.props.onRef(this);
	}

	// borrar referencia
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	// limpiar campos completados por el usuario
	cleanData = () => {
		this.setState({
			name: "",
			dataType: Constants.TEMPLATES.TYPES.TEXT,
			options: [],
			required: false
		});
	};

	// abrir dialogo
	open = type => {
		this.cleanData();
		this.setState({
			type: type,
			isOpen: true
		});
	};

	// cerrar dialogo
	close = () => {
		this.cleanData();
		this.setState({
			type: undefined,
			isOpen: false
		});
	};

	// actualiza campo
	updateField = (name, value) => {
		// this.setState({ fields: fields });
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
		this.props.onAccept(data, type);
	};

	// retornar dialogo para agregar o eliminar campos del modelo
	render = () => {
		const title = this.props.title;
		const isCheckbox = this.state.dataType === Constants.TEMPLATES.TYPES.CHECKBOX;

		return (
			<Dialog open={this.state.isOpen} onClose={this.close} aria-labelledby="form-dialog-title">
				<DialogTitle className="DialogTitle">{title}</DialogTitle>
				<DialogContent>
					{this.renderDialogName()}
					{isCheckbox && this.renderDialogCheckbox()}
					{this.renderDialogTypes()}
					{this.renderDialogRequired()}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.close} color="primary">
						{Messages.EDIT.DIALOG.FIELD.CLOSE}
					</Button>
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
				</DialogActions>
			</Dialog>
		);
	};

	// mostrar controles para definir el nombre del campo a agregar
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

	// mostrar controles para definir si el campo es requerido o no
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

	// mostrar controles para definir el tipo de dato para el campo a agregar
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
						if (Object.keys(Constants.TEMPLATES.SHARED_TYPES).indexOf(event.target.value) >= 0) {
							this.setState({ name: event.target.value, dataType: "Text" });
						} else {
							this.setState({ dataType: event.target.value });
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

	// mostrar controles para definir los valores posibles en caso que el tipo elegido sea "checkbox"
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
}
