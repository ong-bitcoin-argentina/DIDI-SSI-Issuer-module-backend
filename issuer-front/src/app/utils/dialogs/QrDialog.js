import React, { Component } from "react";

import Messages from "../../../constants/Messages";
import Spinner from "../Spinner";
import ConfirmationDialog from "./ConfirmationDialog";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";

import TemplateService from "../../../services/TemplateService";
import ParticipantService from "../../../services/ParticipantService";
import Cookie from "js-cookie";
import RegisterService from "../../../services/RegisterService";
import BlockchainName from "./blockchainName";

var QRCode = require("qrcode");

let interval;
export default class QrDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			parts: [],
			loading: false,
			isOpen: false,
			qrSet: false,
			registers: []
		};
	}

	// generar referencia para abrirlo desde el padre y pooling de participantes
	componentDidMount() {
		this.props.onRef(this);
		const self = this;

		interval = setInterval(function () {
			if (self.state.qrSet) {
				const token = Cookie.get("token");
				ParticipantService.getNew(
					token,
					self.state.requestCode,
					function (participant) {
						if (participant && self.state.qrSet) {
							if (self.qrLoadedDialog) self.qrLoadedDialog.open();
							self.close();

							if (self.props.onDataReceived) self.props.onDataReceived([participant]);

							self.setState({
								participant: participant,
								qr: undefined,
								qrSet: false,
								isOpen: false,
								error: false
							});
						}
					},
					function (err) {
						self.setState({ loading: false, error: err });
						console.log(err);
					}
				);
			}

			if (self.state.requestSent) {
				self.props.onParticipantsReload();
			}
		}, 10000);

		this.getAllRegister();
	}

	// borrar referencia
	// y parar pooling de participante (espera respuestas del qr)
	componentWillUnmount() {
		this.props.onRef(undefined);
		if (interval) {
			clearInterval(interval);
		}
	}

	async getAllRegister() {
		const token = Cookie.get("token");
		try {
			const registers = await RegisterService.getAll()(token);
			this.setState({ registers });
		} catch (error) {
			this.setState({ registers: [] });
		}
	}

	// abrir dialogo
	open = () => {
		this.setState({
			isOpen: true
		});
	};

	// cerrar dialogo
	close = () => {
		this.setState({
			isOpen: false,
			registerId: undefined
		});
	};

	// muestra qr para carga de datos de participante para un modelo de credencial en particular
	generateQrCode = () => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true, qr: undefined });

		const code = Math.random().toString(36).slice(-8);

		const template = self.props.template ? self.props.template : self.state.selectedTemplate;

		// obtener template
		TemplateService.getQrPetition(
			token,
			template._id,
			code,
			function (qr) {
				self.setState({
					requestCode: code,
					qr: qr,
					participant: undefined,
					loading: false,
					error: false
				});

				setTimeout(function () {
					// renderizar qr
					const canvas = document.getElementById("canvas");
					if (canvas) {
						QRCode.toCanvas(canvas, qr, function (error) {
							if (error) console.error(error);
						});
						self.setState({ qrSet: true });
					}
				}, 100);
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			},
			this.state.registerId
		);
	};

	// retorna el participante cargado
	getParticipant = () => {
		const part = this.state.participant;
		if (part) this.setState({ participant: undefined });
		return part;
	};

	// retorna dialogo
	render = () => {
		const title = this.props.title;
		const selected = this.props.template;
		const loading = this.state.loading || this.props.loading;

		return (
			<div>
				{this.renderQrLoadedDialog()}
				<Dialog
					className={loading ? "Loading QrDialog" : "QrDialog"}
					open={this.state.isOpen}
					onClose={this.close}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="DialogTitle">{title}</DialogTitle>
					<DialogContent>
						{Spinner.render(loading)}
						{this.renderSelectRegisterInput()}
						<div className="QrReq">
							{!selected && this.renderTemplateSelector()}
							{this.renderParticipantSelector()}
							{this.renderQrPetition()}
							{this.renderQrButtons()}
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	};

	handleRegister = event => {
		const { value } = event.target;
		this.setState({ registerId: value });
	};

	renderSelectRegisterInput = () => {
		const { registers } = this.state;
		return (
			<div className="QrTemplateSelector" style={{ margin: "25px 0", width: "93%" }}>
				<div className="DataName">Emisor</div>
				<Select
					labelId="register-select-label"
					id="register"
					fullWidth
					name="registerId"
					label="Register"
					onChange={this.handleRegister}
				>
					{registers.length !== 0 &&
						registers.map(({ name, did, _id }) => (
							<MenuItem key={_id} value={_id}>
								{name}
								<BlockchainName did={did} />
							</MenuItem>
						))}
				</Select>
			</div>
		);
	};

	// muestra el dialogo de "participante cargado por qr"
	renderQrLoadedDialog = () => {
		const participant = this.state.participant;
		return (
			<ConfirmationDialog
				onRef={ref => (this.qrLoadedDialog = ref)}
				title={Messages.EDIT.DIALOG.QR.LOADED_BY_QR(participant ? participant.name : "")}
				message={""}
				confirm={Messages.EDIT.BUTTONS.CLOSE}
				hideClose={true}
			/>
		);
	};

	// mostrar selector de participantes
	renderParticipantSelector = () => {
		const participants = this.props.participants;
		return (
			<div>
				{participants && participants.length > 0 && <div>{Messages.EDIT.DIALOG.PARTICIPANT.TITLE}</div>}
				{participants && participants.length > 0 && (
					<Select
						className="ParticipantsSelector"
						multiple
						displayEmpty
						value={this.state.parts}
						onChange={event => {
							this.setState({ parts: event.target.value });
						}}
						renderValue={selected => selected.map(sel => sel.name).join(", ")}
					>
						{participants.map((elem, key) => {
							return (
								<MenuItem key={"ParticipantsSelector-" + key} value={elem}>
									<Checkbox checked={this.state.parts.indexOf(elem) > -1} />
									<ListItemText primary={elem.name} />
								</MenuItem>
							);
						})}
					</Select>
				)}
			</div>
		);
	};

	// mostrar selector de modelos de credencial para el qr
	renderTemplateSelector = () => {
		const template = this.props.template;
		const templates = this.props.templates;
		if (template || !templates) {
			return <div></div>;
		}

		return (
			<div className="QrTemplateSelector">
				{!this.state.qrSet && <div>{Messages.QR.TEMPLATE_SELECT_MESSAGE}</div>}
				{this.state.qrSet && <div>{Messages.QR.QR_MESSAGE}</div>}

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

	// mostrar el qr
	renderQrPetition() {
		const qr = this.state.qr;
		if (!qr) {
			return <div></div>;
		}

		return (
			<div className="QrPetition">
				<canvas id="canvas"></canvas>
				<div className="QR_PD">{Messages.QR.QR_PD}</div>
			</div>
		);
	}

	// mostrar botones al pie del dialogo del qr
	renderQrButtons = () => {
		const disabled = !this.state.selectedTemplate && !this.props.template;
		const participants = this.props.participants;
		const self = this;

		return (
			<div className="QrButtons">
				<button className="CloseButton" onClick={self.close}>
					{Messages.EDIT.BUTTONS.CANCEL}
				</button>

				{participants && participants.length > 0 && (
					<button
						className="QrButton"
						disabled={self.state.parts.length === 0}
						onClick={() => {
							if (self.props.onDataReceived) {
								self.props.onDataReceived(self.state.parts);
								self.close();
							}
						}}
					>
						{Messages.EDIT.DIALOG.PARTICIPANT.CREATE}
					</button>
				)}

				<button className="QrButton" disabled={disabled} onClick={self.generateQrCode}>
					{Messages.QR.BUTTONS.GENERATE}
				</button>
			</div>
		);
	};
}
