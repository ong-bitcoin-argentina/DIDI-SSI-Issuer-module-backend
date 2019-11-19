import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificates.scss";

import CertificateService from "../../../services/CertificateService";

import ReactTable from "react-table";
import "react-table/react-table.css";

import MaterialIcon from "material-icons-react";

import Cookie from "js-cookie";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class Certificates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			certificates: [],
			isDialogOpen: false,
			name: ""
		};
	}

	getCertificatesData = (self, cert) => {
		const emmited = cert.emmitedOn;

		return {
			_id: cert._id,
			certName: cert.name,
			createdOn: emmited ? cert.emmitedOn.split("T")[0] : "-",
			firstName: cert.firstName,
			lastName: cert.lastName,
			actions: (
				<div className="Actions">
					{!emmited && (
						<div
							className="EmmitAction"
							onClick={() => {
								self.onCertificateEmmit(cert._id);
							}}
						>
							{Messages.LIST.BUTTONS.EMMIT}
						</div>
					)}
					{
						<div
							className="EditAction"
							onClick={() => {
								self.onCertificateEdit(cert._id);
							}}
						>
							{emmited ? Messages.LIST.BUTTONS.VIEW : Messages.LIST.BUTTONS.EDIT}
						</div>
					}
					{!emmited && (
						<div
							className="DeleteAction"
							onClick={() => {
								self.onCertificateDelete(cert._id);
							}}
						>
							{Messages.LIST.BUTTONS.DELETE}
						</div>
					)}
				</div>
			)
		};
	};

	componentDidMount() {
		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true });
		CertificateService.getAll(
			token,
			async function(certificates) {
				certificates = certificates.map(certificate => {
					return self.getCertificatesData(self, certificate);
				});
				self.setState({ certificates: certificates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	onCertificateDelete = id => {
		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true });
		CertificateService.delete(
			token,
			id,
			async function(cert) {
				const certificates = self.state.certificates.filter(t => t._id !== cert._id);
				self.setState({ certificates: certificates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onCertificateEmmit = id => {
		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true });
		CertificateService.emmit(
			token,
			id,
			async function(_) {
				self.componentDidMount();
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onCertificateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	onCertificateCreate = () => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT);
	};

	moveToTemplates = () => {
		this.props.history.push(Constants.ROUTES.TEMPLATES);
	};

	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	onDialogOpen = () => this.setState({ isDialogOpen: true, name: "" });
	onDialogClose = () => this.setState({ isDialogOpen: false, name: "" });

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}
		const loading = this.state.loading;
		const isDialogOpen = this.state.isDialogOpen;
		return (
			<div className="Certificates">
				{isDialogOpen && this.renderDialog()}
				{this.renderSectionButtons()}
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}

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
					<Button onClick={this.onCertificateCreate} disabled={!this.state.name} color="primary">
						{Messages.LIST.DIALOG.CREATE}
					</Button>
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.LIST.DIALOG.CLOSE}
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	renderSectionButtons = () => {
		return (
			<div className="HeadButtons">
				<div className="SectionButtons">
					<button className="MoveButton" disabled>
						{Messages.LIST.BUTTONS.TO_CERTIFICATES}
					</button>
					<button className="MoveButton" onClick={this.moveToTemplates}>
						{Messages.LIST.BUTTONS.TO_TEMPLATES}
					</button>
				</div>
				<button className="CreateButton" onClick={this.onCertificateCreate}>
					<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
					<div className="CreateButtonText">{Messages.LIST.BUTTONS.CREATE_CERT}</div>
				</button>
			</div>
		);
	};

	renderTable = () => {
		const certificates = this.state.certificates;
		const columns = [
			/*{
				Header: "Id",
				accessor: "_id"
			},*/
			{
				Header: Messages.LIST.TABLE.LAST_NAME,
				accessor: "lastName"
			},
			{
				Header: Messages.LIST.TABLE.NAME,
				accessor: "firstName"
			},
			{
				Header: Messages.LIST.TABLE.CERT,
				accessor: "certName"
			},
			{
				Header: Messages.LIST.TABLE.EMISSION_DATE,
				accessor: "createdOn"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];

		return (
			<div className="CertificateTable">
				<ReactTable
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={certificates}
					columns={columns}
					defaultPageSize={Constants.CERTIFICATES.TABLE.PAGE_SIZE}
					minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
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

export default withRouter(Certificates);
