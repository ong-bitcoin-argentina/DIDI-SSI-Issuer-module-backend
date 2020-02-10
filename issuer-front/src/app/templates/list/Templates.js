import React, { Component } from "react";
import { withRouter } from "react-router";
import "./Templates.scss";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import MaterialIcon from "material-icons-react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class Templates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			isDialogOpen: false,
			name: ""
		};
	}

	// abrir dialogo de creacion de modelos
	onDialogOpen = () => this.setState({ isDialogOpen: true, name: "" });

	// cerrar dialogo de creacion de modelos
	onDialogClose = () => this.setState({ isDialogOpen: false, name: "" });

	// actualizar nombre del modelo a crear
	updateName = event => {
		this.setState({ name: event.target.value, error: "" });
	};

	render() {
		const loading = this.props.loading;
		const isDeleteDialogOpen = this.props.isDeleteDialogOpen;
		const isDialogOpen = this.state.isDialogOpen;
		const templateId = this.props.selectedTemplateId;
		return (
			<div className="Templates">
				{this.renderSectionButtons()}
				{isDeleteDialogOpen && templateId && this.renderDeleteDialog(templateId)}
				{isDialogOpen && this.renderDialog()}
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{this.props.error && this.props.error.message}</div>
			</div>
		);
	}

	renderSectionButtons = () => {
		const selected = this.props.selected;
		return (
			<div className="HeadButtons">
				{selected && (
					<button className="CreateButton" onClick={this.onDialogOpen}>
						<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
						<div className="CreateButtonText">{Messages.LIST.BUTTONS.CREATE_TEMPLATE}</div>
					</button>
				)}
			</div>
		);
	};

	renderDialog = () => {
		return (
			<Dialog open={this.state.isDialogOpen} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.LIST.DIALOG.TITLE}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label={Messages.LIST.DIALOG.NAME}
						type="text"
						onChange={this.updateName}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							this.onDialogClose();
							this.props.onTemplateCreate(this.state.name);
						}}
						disabled={!this.state.name}
						color="primary"
					>
						{Messages.LIST.DIALOG.CREATE}
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.LIST.DIALOG.CANCEL}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderDeleteDialog = templateId => {
		const isOpen = this.props.isDeleteDialogOpen;
		return (
			<Dialog open={isOpen} onClose={this.props.onDeleteDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.LIST.DIALOG.DELETE_TEMPLATE_TITLE}</DialogTitle>
				<DialogContent>
					<div>{Messages.LIST.DIALOG.DELETE_CONFIRMATION}</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							this.props.onDeleteDialogClose();
							this.props.onTemplateDelete(templateId);
						}}
						color="primary"
					>
						{Messages.LIST.DIALOG.DELETE}
					</Button>
					<Button onClick={this.props.onDeleteDialogClose} color="primary">
						{Messages.LIST.DIALOG.CANCEL}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderTable = () => {
		const templates = this.props.templates;
		const columns = this.props.columns ? this.props.columns : [];

		return (
			<div className="TemplateTable">
				<ReactTable
					sortable={false}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={templates}
					columns={columns}
					defaultPageSize={Constants.TEMPLATES.TABLE.PAGE_SIZE}
					minRows={Constants.TEMPLATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};

	renderButtons = () => {
		return (
			<button className="LogoutButton" onClick={this.props.onLogout}>
				{Messages.LIST.BUTTONS.EXIT}
			</button>
		);
	};
}

export default withRouter(Templates);
