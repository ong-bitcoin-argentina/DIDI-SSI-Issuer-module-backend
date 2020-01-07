import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./QrRequest.scss";

import TemplateService from "../../services/TemplateService";
import ParticipantService from "../../services/ParticipantService";
import Cookie from "js-cookie";

import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

var QRCode = require("qrcode");

class QrRequest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			qrSet: false
		};
	}

	componentDidMount() {
		const self = this;
		setInterval(function() {
			if (self.state.qr && self.state.selectedTemplate) {
				ParticipantService.getNew(
					self.state.selectedTemplate._id,
					function(participant) {
						if (participant) {
							self.setState({ participant: participant, waitingQr: false, qr: undefined });
							self.onQrAnswerDetected(participant);
						}
					},
					function(err) {
						self.setState({ error: err });
						console.log(err);
					}
				);
			}
		}, 10000);
	}

	onQrAnswerDetected = participant => {
		console.log(participant);
	};

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
					loading: false,
					qrSet: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// volver a listado de certificados
	onBack = () => {
		this.props.history.push(Constants.ROUTES.CERTIFICATES);
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
					{!loading && part && this.renderParticipant(part)}
					{!loading && this.renderParticipantButtons()}
				</div>
			);
		}

		return (
			<div className="QrReq">
				{/* !loading && this.renderNameInput() */}
				{!loading && this.renderTemplateSelector()}
				{!loading && this.renderQrPetition()}
				{!loading && this.renderQrButtons()}
			</div>
		);
	}

	/*
	renderNameInput = () => {
		return (
			<div className="QrNameSelector">
				<div className="DataName">{Messages.QR.FULL_NAME}</div>
				<input
					type="text"
					className="DataInput"
					onChange={event => {
						this.setState({ fullName: event.target.value });
					}}
				/>
			</div>
		);
	};
	*/

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

		const self = this;
		if (!self.state.qrSet) {
			setTimeout(function() {
				const canvas = document.getElementById("canvas");
				if (canvas) {
					QRCode.toCanvas(canvas, qr, function(error) {
						if (error) console.error(error);
					});
					self.setState({ qrSet: true });
				}
			}, 100);
		}

		return (
			<div className="QrPetition">
				<canvas id="canvas"></canvas>
			</div>
		);
	}

	renderParticipant = part => {
		return (
			<div className="Participant">
				<div>{Messages.QR.LOAD_SUCCESS(part.name)}</div>
				{/*part.data.map(data => {
					return (
						<div>
							{data.name} : {data.value}
						</div>
					);
				})*/}
			</div>
		);
	};

	renderQrButtons = () => {
		const disabled = !this.state.selectedTemplate;

		return (
			<div className="QrButtons">
				<button disabled={disabled} onClick={this.generateQrCode}>
					{Messages.QR.BUTTONS.GENERATE}
				</button>
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
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
