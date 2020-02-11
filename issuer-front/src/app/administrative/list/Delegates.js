import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Delegates.scss";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";
import Cookie from "js-cookie";

import ReactTable from "react-table";
import "react-table/react-table.css";

import MaterialIcon from "material-icons-react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class Delegates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDialogOpen: false,
			loading: false
		};
	}

	updateName = event => {
		this.setState({ name: event.target.value });
	};

	updateDid = event => {
		this.setState({ did: event.target.value });
	};

	// abrir dialogo de creacion de modelos
	onDialogOpen = () => this.setState({ isDialogOpen: true, name: "", did: "" });

	// cerrar dialogo de creacion de modelos
	onDialogClose = () => this.setState({ isDialogOpen: false, name: "", did: "" });

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const error = this.state.error;
		const loading = this.state.loading;
		return (
			<div className="Admin">
				{this.renderDialog()}
				{this.renderSectionButtons()}
				{this.renderDeleteDialog()}
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{error && error.message}</div>
			</div>
		);
	}

	renderSectionButtons = () => {
		const selected = this.props.selected;
		return (
			<div className="HeadButtons">
				{selected && (
					<button className="CreateButton" onClick={this.onDialogOpen}>
						<MaterialIcon icon={Constants.DELEGATES.ICONS.ADD_BUTTON} />
						<div className="CreateDelegateButtonText">{Messages.LIST.BUTTONS.CREATE_DELEGATE}</div>
					</button>
				)}
			</div>
		);
	};

	renderTable = () => {
		const delegates = this.props.delegates;
		const columns = this.props.columns ? this.props.columns : [];

		return (
			<div className="DelegatesTable">
				<ReactTable
					sortable={false}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={delegates}
					columns={columns}
					defaultPageSize={Constants.DELEGATES.TABLE.PAGE_SIZE}
					minRows={Constants.DELEGATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};

	renderDialog = () => {
		return (
			<Dialog open={this.state.isDialogOpen} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.LIST.DIALOG.CREATE_DELEGATE_TITLE}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="did"
						label={Messages.LIST.DIALOG.DID}
						type="text"
						onChange={this.updateDid}
						fullWidth
					/>
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
							this.props.onDelegateCreate(this.state.did, this.state.name);
						}}
						disabled={!this.state.name && !this.state.did}
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

	renderDeleteDialog = () => {
		const isOpen = this.props.isDeleteDialogOpen;
		return (
			<Dialog open={isOpen} onClose={this.props.onDeleteDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.LIST.DIALOG.DELETE_DELEGATE_TITLE}</DialogTitle>
				<DialogContent>
					<div>{Messages.LIST.DIALOG.DELETE_CONFIRMATION}</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							this.props.onDeleteDialogClose();
							this.props.onDelegateDelete();
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

	renderButtons = () => {
		return (
			<div className="AdminButtons">
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};
}

export default withRouter(Delegates);
