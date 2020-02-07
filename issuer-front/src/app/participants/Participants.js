import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Participants.scss";

import ReactTable from "react-table";
import "react-table/react-table.css";

import ReactFileReader from "react-file-reader";

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

let interval;
class Participants extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			isQrDialogOpen: false,
			isRequestDialogOpen: false,
			certificates: [],
			selectedNames: [],
			qrSet: false,
			requestSent: false
		};
	}

	componentWillUnmount() {
		if (interval) {
			clearInterval(interval);
		}
	}

	componentDidMount() {
		const self = this;
		ParticipantService.getAllDids(
			function(dids) {
				self.setState({ dids: dids, error: false });
			},
			function(err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);

		interval = setInterval(function() {
			if (self.state.qrSet) {
				ParticipantService.getNew(
					self.state.requestCode,
					function(participant) {
						if (participant && self.state.qrSet)
							self.setState({ participant: participant, qr: undefined, error: false });
					},
					function(err) {
						self.setState({ loading: false, error: err });
						console.log(err);
					}
				);
			}

			if (self.state.requestSent) {
				self.props.onParticipantsReload();
				ParticipantService.getNew(
					self.state.globalRequestCode,
					function(participant) {
						if (participant && self.state.requestSent) {
							self.setState({ requestSent: false, error: false });
						}
					},
					function(err) {
						self.setState({ loading: false, error: err });
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

		const code = Math.random()
			.toString(36)
			.slice(-8);

		// obtener template
		TemplateService.getQrPetition(
			token,
			self.state.selectedTemplate._id,
			code,
			function(qr) {
				self.setState({
					requestCode: code,
					qr: qr,
					participant: undefined,
					loading: false,
					error: false
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
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	canSendRequest = () => {
		const regex = /did:ethr:0x[0-9A-Fa-f]{40}/;
		const did = this.state.did;
		const validDid = did && did.match(regex);
		const selectedName = this.state.selectedNames.length > 0;
		return this.state.certificates && this.state.certificates.length && (validDid || selectedName);
	};

	sendRequest = () => {
		const token = Cookie.get("token");
		const self = this;

		const globalRequestCode = Math.random()
			.toString(36)
			.slice(-8);

		const didList = self.state.dids;
		const dids = self.state.selectedNames.map(name => {
			const match = didList.find(didElem => didElem.name === name);
			return match.did;
		});

		if (self.state.did) dids.push(self.state.did);

		self.setState({ isRequestDialogOpen: false });
		// mandar pedido
		TemplateService.sendRequest(
			token,
			dids,
			self.state.certificates,
			globalRequestCode,
			function(_) {
				self.setState({
					requestSent: true,
					globalRequestCode: globalRequestCode,
					awaitingDid: self.state.did,
					error: false
				});
			},
			function(err) {
				self.props.onParticipantsReload();
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	LoadDidsFromCsv = files => {
		const self = this;
		var reader = new FileReader();
		reader.onload = function(e) {
			const result = [];
			const data = reader.result.split(/[\r\n,]+/);

			let index = 0;
			do {
				const did = data[index];
				const name = index + 1 < data.length ? data[index + 1] : "";
				if (did && name) result.push({ did: did, name: name });
				index += 2;
			} while (index < data.length);

			self.addDids(result);
		};
		reader.readAsText(files[0]);
	};

	addDids = data => {
		const self = this;
		this.setState({ loading: true });
		ParticipantService.createNew(
			data,
			function(dids) {
				const local = self.state.dids;
				const acum = {};
				for (let did of dids) acum[did.did] = did.name;
				for (let did of local) acum[did.did] = did.name;

				const result = [];
				for (let key of Object.keys(acum)) {
					result.push({ did: key, name: acum[key] });
				}

				self.props.onParticipantsReload();
				self.setState({ loading: false, dids: result, error: false });
			},
			function(err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	onRequestDialogClose = () => {
		this.setState({ isRequestDialogOpen: false });
	};

	onRequestDialogOpen = () => {
		this.setState({ isRequestDialogOpen: true, certificates: [], did: undefined, requestSent: false });
	};

	onQrDialogClose = () => {
		this.setState({ isQrDialogOpen: false, qr: undefined });
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
		if (this.state.error) {
			this.setState({ loading: false, error: false });
		} else {
			this.setState({
				qrSet: false,
				requestSent: false,
				isQrDialogOpen: false,
				isRequestDialogOpen: false
			});
			this.componentDidMount();
			// this.props.history.push(Constants.ROUTES.LOGIN);
		}
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		// console.log(this.props.participants);

		const loading = this.state.loading;
		if (loading) return <div></div>;

		const error = this.state.error;
		return this.renderAddParticipantScreen(error);
	}

	renderAddParticipantScreen = error => {
		return (
			<div className="QrReq">
				{this.renderRequestDialog()}
				{this.renderQrDialog()}
				{this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{error && error.message}</div>
			</div>
		);
	};

	renderTable = () => {
		const participants = this.props.participants;
		const columns = this.props.columns ? this.props.columns : [];

		return (
			<div className="TemplateTable">
				<ReactTable
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={participants}
					columns={columns}
					defaultPageSize={Constants.TEMPLATES.TABLE.PAGE_SIZE}
					minRows={Constants.TEMPLATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};

	renderButtons = () => {
		return (
			<div className="QrRequestButtons">
				<div className="ButtonsRow">
					<button className="QrDialogButton" onClick={this.onQrDialogOpen}>
						{Messages.QR.BUTTONS.QR_LOAD}
					</button>
					<button className="QrRequestButton" onClick={this.onRequestDialogOpen}>
						{Messages.QR.BUTTONS.REQUEST}
					</button>
				</div>

				<div className="ButtonsRow">
					<ReactFileReader className="LoadDidsFromCsv" handleFiles={this.LoadDidsFromCsv} fileTypes={".csv"}>
						<button className="LoadDidsFromCsv">{Messages.EDIT.BUTTONS.LOAD_DIDS_FROM_CSV}</button>
					</ReactFileReader>

					<button className="LogoutButton" onClick={this.onLogout}>
						{Messages.EDIT.BUTTONS.EXIT}
					</button>
				</div>
			</div>
		);
	};

	renderQrDialog = () => {
		return (
			<Dialog open={this.state.isQrDialogOpen} onClose={this.onQrDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.EDIT.DIALOG.QR.LOAD_BY_QR}</DialogTitle>
				<DialogContent>
					<div className="QrReq">
						{!this.state.qrSet && <div>{Messages.QR.TEMPLATE_SELECT_MESSAGE}</div>}
						{this.state.qrSet && <div>{Messages.QR.QR_MESSAGE}</div>}
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
				<DialogTitle id="DialogTitle">{Messages.EDIT.DIALOG.QR.LOAD_BY_REQUEST}</DialogTitle>
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
				<div className="CertificateSelector">
					<div className="DataName">{Messages.QR.CERTIFICATE_SELECT}</div>

					<Select
						className="CertificateSelect"
						multiple
						displayEmpty
						value={this.state.certificates}
						onChange={event => {
							this.setState({ certificates: event.target.value });
						}}
						renderValue={_ => (this.state.certificates ? this.state.certificates.join(",") : "")}
					>
						{certificates.map((elem, key) => {
							return (
								<MenuItem key={"CertificateSelector-" + key} value={elem}>
									<Checkbox checked={this.state.certificates && this.state.certificates.indexOf(elem) >= 0} />
									<ListItemText primary={elem} />
								</MenuItem>
							);
						})}
					</Select>
				</div>

				<div className="DataName">{Messages.QR.DID_SELECT}</div>
				{/*
				<input
					type="text"
					className="DataInput"
					value={this.state.did}
					onChange={event => {
						this.setState({ did: event.target.value });
					}}
				/>
				*/}

				{this.state.dids && (
					<Select
						className="DidSelect"
						multiple
						displayEmpty
						value={this.state.selectedNames}
						onChange={event => {
							this.setState({ selectedNames: event.target.value });
						}}
						renderValue={value => {
							return value ? value.join(",") : "";
						}}
					>
						{this.state.dids.map((elem, key) => {
							return (
								<MenuItem key={"CertificateSelector-" + key} value={elem.name}>
									<Checkbox checked={this.state.selectedNames && this.state.selectedNames.indexOf(elem.name) >= 0} />
									<ListItemText primary={elem.name} />
								</MenuItem>
							);
						})}
					</Select>
				)}
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

	renderResultButtons = () => {
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

export default withRouter(Participants);
