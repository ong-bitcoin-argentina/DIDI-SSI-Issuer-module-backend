import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./QrRequest.scss";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

import TemplateService from "../../services/TemplateService";
import ParticipantService from "../../services/ParticipantService";
import Cookie from "js-cookie";

import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

var QRCode = require("qrcode");

class QrRequest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			isQrDialogOpen: false,
			isRequestDialogOpen: false,
			qrSet: false
		};
	}

	componentDidMount() {
		const self = this;
		setInterval(function() {
			if (self.state.qrSet || self.state.awaitingDid) {
				ParticipantService.getNew(
					self.state.selectedTemplate._id,
					function(participant) {
						if (self.state.awaitingDid && participant.data[0].value === self.state.awaitingDid)
							self.setState({ participant: participant, awaitingDid: undefined });
						if (participant && self.state.qrSet)
							self.setState({ participant: participant, qrSet: false, qr: undefined });
					},
					function(err) {
						self.setState({ error: err });
						console.log(err);
					}
				);
			}
		}, 10000);
	}

	generateQrCode = () => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true, qr: undefined });

		// obtener template
		TemplateService.getQrPetition(
			token,
			self.state.selectedTemplate._id,
			function(qr) {
				self.setState({
					qr: qr,
					participant: undefined,
					loading: false
				});

				setTimeout(function() {
					const canvas = document.getElementById("canvas");
					if (canvas) {
						QRCode.toCanvas(canvas, qr, function(error) {
							if (error) console.error(error);
						});
						self.setState({ qrSet: true });
					}
				}, 100);
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	canSendRequest = () => {
		const regex = /did:ethr:0x[0-9A-Fa-f]{40}/;
		const did = this.state.did;
		const validDid = did && did.match(regex);
		return this.state.certificate && validDid;
	};

	sendRequest = () => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });

		// mandar pedido
		TemplateService.sendRequest(
			token,
			self.state.did,
			self.state.certificate,
			function(_) {
				self.setState({
					loading: false,
					isRequestDialogOpen: false,
					awaitingDid: self.state.did
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onRequestDialogClose = () => {
		this.setState({ isRequestDialogOpen: false });
	};

	onRequestDialogOpen = () => {
		this.setState({ isRequestDialogOpen: true, certificate: undefined, did: undefined });
	};

	onQrDialogClose = () => {
		this.setState({ isQrDialogOpen: false, qr: undefined, qrSet: false });
	};

	onQrDialogOpen = () => {
		this.setState({ isQrDialogOpen: true, qr: undefined, qrSet: false, selectedTemplate: undefined });
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// volver a listado de certificados
	onBack = () => {
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const loading = this.state.loading;
		const part = this.state.participant;
		if (part) {
			return (
				<div className="ParticipantLoaded">
					<div className="QrTitle">{Messages.EDIT.DIALOG.QR.TITLE}</div>
					{!loading && part && this.renderParticipant(part)}
					{!loading && this.renderParticipantButtons()}
				</div>
			);
		}

		return (
			<div className="QrReq">
				{!loading && this.renderRequestDialog()}
				{!loading && this.renderQrDialog()}
				<div className="QrTitle">{Messages.EDIT.DIALOG.QR.TITLE}</div>
				{!loading && this.renderButtons()}
			</div>
		);
	}

	renderButtons = () => {
		return (
			<div className="QrRequestButtons">
				<button className="QrDialogButton" onClick={this.onQrDialogOpen}>
					{Messages.QR.BUTTONS.QR_LOAD}
				</button>
				<button className="QrRequestButton" onClick={this.onRequestDialogOpen}>
					{Messages.QR.BUTTONS.REQUEST}
				</button>
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};

	renderQrDialog = () => {
		return (
			<Dialog open={this.state.isQrDialogOpen} onClose={this.onQrDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.EDIT.DIALOG.QR.TITLE}</DialogTitle>
				<DialogContent>
					<div className="QrReq">
						{this.renderTemplateSelector()}
						{this.renderQrPetition()}
						{this.renderQrButtons()}
					</div>
				</DialogContent>
			</Dialog>
		);
	};

	renderTemplateSelector = () => {
		const templates = this.props.templates;
		if (!templates) {
			return <div></div>;
		}

		return (
			<div className="QrTemplateSelector">
				<div className="DataName">{Messages.QR.TEMPLATE_SELECT}</div>

				<Autocomplete
					options={templates}
					getOptionLabel={option => (option ? option.name : "")}
					value={this.state.selectedTemplate ? this.state.selectedTemplate : ""}
					renderInput={params => <TextField {...params} variant="standard" label={""} placeholder="" fullWidth />}
					onChange={(_, value) => {
						this.setState({ selectedTemplate: value });
					}}
				/>
			</div>
		);
	};

	renderQrPetition() {
		const qr = this.state.qr;
		if (!qr) {
			return <div></div>;
		}

		return (
			<div className="QrPetition">
				<canvas id="canvas"></canvas>
			</div>
		);
	}

	renderQrButtons = () => {
		const disabled = !this.state.selectedTemplate;

		return (
			<div className="QrButtons">
				<button className="QrButton" disabled={disabled} onClick={this.generateQrCode}>
					{Messages.QR.BUTTONS.GENERATE}
				</button>
				<button className="CloseButton" onClick={this.onQrDialogClose}>
					{Messages.EDIT.BUTTONS.CANCEL}
				</button>
			</div>
		);
	};

	renderRequestDialog = () => {
		return (
			<Dialog
				open={this.state.isRequestDialogOpen}
				onClose={this.onRequestDialogClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="DialogTitle">{Messages.EDIT.DIALOG.QR.TITLE}</DialogTitle>
				<DialogContent>
					<div className="QrReq">
						{this.renderRequestSelector()}
						{this.renderRequestButtons()}
					</div>
				</DialogContent>
			</Dialog>
		);
	};

	renderRequestSelector = () => {
		const certificates = Constants.CERTIFICATES.REQUEST_TYPES;
		return (
			<div className="QrTemplateSelector">
				<div className="DataName">{Messages.QR.DID_SELECT}</div>
				<input
					type="text"
					className="DataInput"
					value={this.state.did}
					onChange={event => {
						this.setState({ did: event.target.value });
					}}
				/>

				<div className="CertificateSelector">
					<div className="DataName">{Messages.QR.CERTIFICATE_SELECT}</div>

					<Select
						className="CertificateSelect"
						displayEmpty
						value={this.state.certificate || ""}
						onChange={event => {
							this.setState({ certificate: event.target.value });
						}}
						renderValue={_ => this.state.certificate}
					>
						{certificates.map((elem, key) => {
							return (
								<MenuItem key={"CertificateSelector-" + key} value={elem}>
									<Checkbox checked={this.state.certificate === elem} />
									<ListItemText primary={elem} />
								</MenuItem>
							);
						})}
					</Select>
				</div>
			</div>
		);
	};

	renderRequestButtons = () => {
		return (
			<div className="QrButtons">
				<button disabled={!this.canSendRequest()} className="SendButton" onClick={this.sendRequest}>
					{Messages.EDIT.BUTTONS.SEND}
				</button>
				<button className="CloseButton" onClick={this.onRequestDialogClose}>
					{Messages.EDIT.BUTTONS.CANCEL}
				</button>
			</div>
		);
	};

	renderParticipant = part => {
		return (
			<div className="Participant">
				<div>{Messages.QR.LOAD_SUCCESS(part.name)}</div>
			</div>
		);
	};

	renderParticipantButtons = () => {
		return (
			<div className="CertificateButtons">
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

export default withRouter(QrRequest);
