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

	// abrir dialogo de creacion de templates
	onDialogOpen = () => this.setState({ isDialogOpen: true, name: "" });

	// cerrar dialogo de creacion de templates
	onDialogClose = () => this.setState({ isDialogOpen: false, name: "" });

	// actualizar nombre del template a crear
	updateName = event => {
		this.setState({ name: event.target.value, error: "" });
	};

	render() {
		const loading = this.props.loading;
		const isDialogOpen = this.state.isDialogOpen;
		return (
			<div className="Templates">
				{this.renderSectionButtons()}
				{isDialogOpen && this.renderDialog()}
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{this.props.error && this.props.message}</div>
			</div>
		);
	}

	renderSectionButtons = () => {
		return (
			<div className="HeadButtons">
				<button className="CreateButton" onClick={this.onDialogOpen}>
					<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
					<div className="CreateButtonText">{Messages.LIST.BUTTONS.CREATE_TEMPLATE}</div>
				</button>
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
						{Messages.LIST.DIALOG.CLOSE}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderTable = () => {
		const templates = this.props.templates;
		const columns = [
			{
				Header: Messages.LIST.TABLE.TEMPLATE,
				accessor: "name"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];

		return (
			<div className="TemplateTable">
				<ReactTable
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
			<button className="LogoutButton" onClick={this.onLogout}>
				{Messages.LIST.BUTTONS.EXIT}
			</button>
		);
	};
}

export default withRouter(Templates);
