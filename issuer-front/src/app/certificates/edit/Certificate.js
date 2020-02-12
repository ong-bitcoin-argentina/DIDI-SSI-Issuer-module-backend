import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificate.scss";

import CertificateService from "../../../services/CertificateService";
import TemplateService from "../../../services/TemplateService";
import ParticipantService from "../../../services/ParticipantService";

import ReactFileReader from "react-file-reader";
import DataRenderer from "../../utils/DataRenderer";

import Cookie from "js-cookie";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

var QRCode = require("qrcode");
let interval;

class Certificate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			isDialogOpen: false,
			waitingQr: false,
			parts: [],
			action: "viewing"
		};
	}

	componentWillUnmount() {
		if (interval) {
			clearInterval(interval);
		}
	}

	// cargar templates, certificado, etc
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		interval = setInterval(function() {
			if (self.state.waitingQr && self.state.template) {
				ParticipantService.getNew(
					token,
					self.state.requestCode,
					function(participant) {
						if (participant) {
							self.setState({ parts: [participant], waitingQr: false, error: false });
							self.onParticipantsAdd();
						}
					},
					function(err) {
						self.setState({ error: err });
						console.log(err);
					}
				);
			}
		}, 10000);

		(async () => {
			this.setState({ loading: true });

			try {
				await this.getTemplates(token);
				if (id) {
					await this.getCert(token, id);
					await this.getTemplate(token);
					await this.getParticipants();
				}
			} catch (err) {
				self.setState({ error: err });
				console.log(err);
			}

			this.setState({ loading: false });
		})();
	}

	getTemplates = function(token) {
		const self = this;
		return new Promise(function(resolve, reject) {
			TemplateService.getAll(
				token,
				function(templates) {
					self.setState({ templates: templates });
					resolve();
				},
				function(err) {
					reject(err);
				}
			);
		});
	};

	getCert = function(token, id) {
		const self = this;
		return new Promise(function(resolve, reject) {
			CertificateService.get(
				token,
				id,
				function(cert) {
					self.setState({
						cert: cert,
						error: false
					});
					resolve();
				},
				function(err) {
					reject(err);
				}
			);
		});
	};

	getTemplate = function(token) {
		const self = this;

		// si el cert fue emitido, no puedo editarlo
		const action = this.state.cert.emmitedOn ? "viewing" : "editing";
		const selectedTemplate = this.state.templates.find(template => template._id === this.state.cert.templateId);

		return new Promise(function(resolve, reject) {
			TemplateService.get(
				token,
				selectedTemplate._id,
				function(template) {
					self.setState({
						action: action,
						selectedTemplate: selectedTemplate,
						template: template,
						error: false
					});
					resolve();
				},
				function(err) {
					reject(err);
				}
			);
		});
	};

	getParticipants = function() {
		const self = this;
		const token = Cookie.get("token");
		return new Promise(function(resolve, reject) {
			ParticipantService.getAll(
				token,
				self.state.template._id,
				function(participants) {
					self.setState({
						participants: participants,
						error: false
					});
					resolve();
				},
				function(err) {
					reject(err);
				}
			);
		});
	};

	// generar certificado a partir del template seleccionado en el combo
	certFromTemplate = template => {
		const data = {
			cert: this.certDataFromTemplate(template, "cert"),
			participant: [this.certDataFromTemplate(template, "participant")],
			others: this.certDataFromTemplate(template, "others")
		};

		return {
			templateId: template._id,
			split: false,
			microCredentials: [],
			data: data
		};
	};

	certDataFromTemplate = (template, field) => {
		return template.data[field].map(data => {
			return {
				name: data.name,
				type: data.type,
				options: data.options,
				value: data.defaultValue ? data.defaultValue : "",
				required: data.required,
				mandatory: data.mandatory
			};
		});
	};

	// agregar info de participante con los datos por defecto del template
	addParticipant = () => {
		const participant = this.state.cert.data.participant;
		participant.push(this.certDataFromTemplate(this.state.template, "participant"));
		this.setState({ cert: this.state.cert });
	};

	createSampleCsv = () => {
		const getSample = function(dataElem) {
			switch (dataElem.type) {
				case Constants.TEMPLATES.TYPES.BOOLEAN:
					return "true/false";
				case Constants.TEMPLATES.TYPES.CHECKBOX:
					let result = "";
					dataElem.options.forEach(elem => (result += elem + "/"));
					result = result.substring(0, result.length - 1);
					return result;
				case Constants.TEMPLATES.TYPES.DATE:
					return "ej: 10/12/2020";
				case Constants.TEMPLATES.TYPES.NUMBER:
					return "un número";
				case Constants.TEMPLATES.TYPES.TEXT:
					if (dataElem.name === Constants.TEMPLATES.MANDATORY_DATA.DID)
						return "ej: did:eth:0x5f6ed832a5fd0f0a58135f9695ea40af8666db31";
					return "un texto";
				case Constants.TEMPLATES.TYPES.PARAGRAPH:
					return "un parrafo";
				default:
					return "";
			}
		};

		let csv = "";

		const certData = this.state.cert.data.cert;
		for (let key of Object.keys(certData)) {
			if (!certData[key].mandatory) {
				csv += certData[key].name + " (" + getSample(certData[key]) + "),";
			}
		}

		const othersData = this.state.cert.data.others;
		if (othersData) {
			for (let key of Object.keys(othersData)) {
				if (!othersData[key].mandatory) {
					csv += othersData[key].name + " (" + getSample(othersData[key]) + "),";
				}
			}
		}

		const partData = this.state.cert.data.participant[0];
		// for (let i = 0; i < 3; i++) {
		for (let key of Object.keys(partData)) {
			csv += partData[key].name + " (" + getSample(partData[key]) + "),";
		}
		//}

		csv = csv.substring(0, csv.length - 1);

		const element = document.createElement("a");
		const file = new Blob([csv], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "sample.csv";
		document.body.appendChild(element);
		element.click();
	};

	// validar que el valor sea un did
	validateDID = function(value) {
		const regex = /did:ethr:0x[0-9A-Fa-f]{40}/;
		if (!value.match(regex)) {
			if (!this.state.error) this.setState({ error: { message: Constants.CERTIFICATES.ERR.INVALID_DID } });
		} else {
			if (this.state.error) this.setState({ error: undefined });
		}
	};

	// agregar info de participante con los datos provenientes de un csv
	// (este csv tiene que tener los datos ordenados de la misma forma que el template)
	loadCertFromCsv = files => {
		let validateValueMatchesType = function(dataElem, value) {
			switch (dataElem.type) {
				case Constants.TEMPLATES.TYPES.BOOLEAN:
					dataElem.value = value;
					return true;
				case Constants.TEMPLATES.TYPES.CHECKBOX:
					const res = dataElem.options.find(elem => elem === value + "");
					if (res) {
						dataElem.value = value;
						return true;
					}
					return false;
				case Constants.TEMPLATES.TYPES.DATE:
					try {
						const dateParts = value.split("/");
						const date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
						if (!date) return false;
						dataElem.value = date;
						return true;
					} catch (err) {
						return false;
					}
				case Constants.TEMPLATES.TYPES.NUMBER:
					if (isNaN(value)) return false;
					dataElem.value = value;
					return true;
				case Constants.TEMPLATES.TYPES.PARAGRAPH:
					if (!value) return false;
					dataElem.value = value;
					return true;
				case Constants.TEMPLATES.TYPES.TEXT:
					if (!value) return false;
					dataElem.value = value;
					return true;
				default:
					return false;
			}
		};

		let assignElement = function(dataElem, data) {
			if (data === "") {
				if (dataElem.required) return Constants.CERTIFICATES.ERR.CSV_REQUIRED_VALUE_MISSING(dataElem.name);
			} else {
				if (!validateValueMatchesType(dataElem, data))
					return Constants.CERTIFICATES.ERR.CSV_REQUIRED_VALUE_INVALID(dataElem.name);
			}
		};

		const self = this;
		var reader = new FileReader();
		reader.onload = function(e) {
			const participant = [];
			const data = reader.result.split(/[\r\n,]+/);

			const certData = JSON.parse(JSON.stringify(self.state.cert.data.cert));
			const othersData = JSON.parse(JSON.stringify(self.state.cert.data.others));
			const partData = self.certDataFromTemplate(self.state.template, "participant");

			const certDataKeys = Object.keys(certData);
			const otherDataKeys = Object.keys(othersData);

			const certDataCount = certDataKeys.length;
			const otherDataCount = otherDataKeys.length;
			const partDataCount = partData.length;

			let index = certDataCount + otherDataCount + partDataCount - 1;

			for (let key of certDataKeys) {
				const dataElem = certData[key];
				if (!dataElem.mandatory) {
					const err = assignElement(dataElem, data[index]);
					if (err) return self.setState({ error: err });
					index++;
				}
			}

			for (let key of otherDataKeys) {
				const dataElem = othersData[key];
				if (!dataElem.mandatory) {
					const err = assignElement(dataElem, data[index]);
					if (err) return self.setState({ error: err });
					index++;
				}
			}

			do {
				const participantData = self.certDataFromTemplate(self.state.template, "participant");
				for (let dataElem of participantData) {
					if (data.length > index) {
						const err = assignElement(dataElem, data[index]);
						if (err) return self.setState({ error: err });
						if (dataElem.name === Constants.CERTIFICATES.MANDATORY_DATA.DID) self.validateDID(dataElem.value);
						index++;
					}
				}
				index += certDataCount + otherDataCount - 1;
				participant.push(participantData);
			} while (data.length > index);

			self.state.cert.data.cert = certData;
			self.state.cert.data.participant = participant;
			self.state.cert.data.others = othersData;

			self.setState({ cert: self.state.cert, error: undefined });
		};
		reader.readAsText(files[0]);
	};

	// eliminar participante
	removeParticipant = index => {
		if (this.state.cert.data.participant.length === 1) {
			const partData = this.state.cert.data.participant[0];
			for (let key of Object.keys(partData)) partData[key].value = "";
		} else {
			this.state.cert.data.participant.splice(index, 1);
		}

		for (let partData of this.state.cert.data.participant) {
			this.validateDID(partData[0].value);
			if (this.state.error) break;
		}
		this.setState({ cert: this.state.cert });
	};

	// borrar data local y generar nuevo cert a partir del template
	templateSelected = selectedTemplate => {
		const token = Cookie.get("token");

		const self = this;
		self.setState({ loading: true });
		// obtener template
		TemplateService.get(
			token,
			selectedTemplate._id,
			function(template) {
				ParticipantService.getAll(
					token,
					template._id,
					function(participants) {
						self.setState({
							selectedTemplate: selectedTemplate,
							participants: participants,
							template: template,
							error: false,
							cert: self.certFromTemplate(template),
							loading: false,
							action: "creating"
						});
					},
					function(err) {
						self.setState({ error: err });
						console.log(err);
					}
				);
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	participantSelected(did, position) {
		const self = this;
		const token = Cookie.get("token");
		self.setState({ loading: true });

		ParticipantService.get(
			token,
			did,
			function(participant) {
				const partToUpdate = self.state.cert.data.participant[position];

				if (participant.data) {
					participant.data.forEach(dataElem => {
						const dataToUpdate = partToUpdate.find(data => {
							const name = data.name.toLowerCase();
							const mappedName = Constants.TEMPLATES.TYPE_MAPPING[data.name];
							const elemName = dataElem.name.toLowerCase();
							return name === elemName || (mappedName && mappedName.toLowerCase() === elemName);
						});
						if (dataToUpdate) dataToUpdate.value = dataElem.value;
					});

					const dataToUpdate = partToUpdate.find(data => data.name.toLowerCase() === "did");
					if (dataToUpdate) dataToUpdate.value = participant.did;
				}

				self.setState({
					participants: self.state.participants,
					error: false,
					action: self.state.action,
					loading: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	onParticipantsAdd = () => {
		const len = this.state.cert.data.participant.length;
		let pos = 0;

		this.setState({ isDialogOpen: false });
		if (this.state.parts.length === 0) return;

		for (let newPart of this.state.parts) {
			if (pos >= len) this.addParticipant();
			this.participantSelected(newPart.did, pos);
			pos++;
		}

		this.setState({ parts: [] });
		if (len >= pos) this.state.cert.data.participant.splice(pos, len - pos);
	};

	// guardar cert y volver a listado de certificados
	onSave = () => {
		const token = Cookie.get("token");
		const cert = this.state.cert;
		const self = this;

		self.setState({ loading: true });
		CertificateService.save(
			token,
			cert,
			async function(_) {
				self.setState({ loading: false, error: false });
				self.props.history.push(Constants.ROUTES.CERTIFICATES);
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	addMicroCredential = () => {
		const cert = this.state.cert;
		cert.microCredentials.push({ title: "", names: [] });
		this.setState({ cert: cert });
	};

	removeMicroCredential = key => {
		const cert = this.state.cert;
		if (cert.microCredentials.length > 1) {
			cert.microCredentials.splice(key, 1);
			this.setState({ cert: cert });
		}
	};

	// actualizar campos seleccionados de la microcredencial
	microcredFieldsSelected = (key, event) => {
		const cert = this.state.cert;
		cert.microCredentials[key].names = event.target.value;
		this.setState({ cert: cert });
	};

	// actualizar nombre de la microcredencial
	microcredNameChanged = (key, event) => {
		const cert = this.state.cert;
		cert.microCredentials[key].title = event.target.value;
		this.setState({ cert: cert });
	};

	splitChanged = value => {
		const cert = this.state.cert;
		cert.split = value;
		if (value === "true") {
			cert.microCredentials = [{ title: "", names: [] }];
		} else {
			cert.microCredentials = [];
		}
		this.setState({ cert: cert });
	};

	// volver a listado de certificados
	onBack = () => {
		if (this.state.loading && this.state.error) {
			this.setState({ loading: false, error: false });
		} else {
			this.props.history.push(Constants.ROUTES.CERTIFICATES);
		}
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// si el boton de guardar esta deshabilitado
	// (algun campo obligatorio sin llenar o el did tiene un formato incorrecto)
	saveDisabled = () => {
		if (!this.state.cert) return true;

		const did = this.state.cert.data.participant[0][0].value;
		const regex = /did:ethr:0x[0-9A-Fa-f]{40}/;
		if (!did.match(regex)) {
			if (!this.state.error) this.setState({ error: { message: Constants.CERTIFICATES.ERR.INVALID_DID } });
			return true;
		}

		const cert = this.state.cert.data.cert;
		const participant = this.state.cert.data.participant.flat();
		const others = this.state.cert.data.others;

		const all = cert.concat(participant).concat(others);
		for (let index in all) {
			const dataElem = all[index];
			if (dataElem.name === Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE) {
				if (new Date(dataElem.value) < new Date()) {
					if (!this.state.error) this.setState({ error: Constants.CERTIFICATES.ERR.EXP_DATE_INVALID });
					return true;
				}
			}

			if (dataElem.required && !dataElem.value) {
				if (!this.state.error) this.setState({ error: Constants.CERTIFICATES.ERR.MISSING_FIELD(dataElem.name) });
				return true;
			}
		}

		return false;
	};

	// abrir dialogo de creacion de participantes
	onDialogOpen = () => {
		this.generateQrCode();
		this.setState({ isDialogOpen: true, parts: [], waitingQr: true });
	};

	// cerrar dialogo de creacion de participantes
	onDialogClose = () => this.setState({ isDialogOpen: false, parts: [], waitingQr: false });

	// obtener codigo qr a mostrar
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
			self.state.template._id,
			code,
			function(qr) {
				self.setState({
					requestCode: code,
					qr: qr,
					loading: false,
					qrSet: false,
					error: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const loading = this.state.loading;
		const error = this.state.error;
		return (
			<div className="Certificate">
				{!loading && this.renderTemplateSelector()}
				{!loading && this.renderCert()}
				{this.renderParticipantDialog()}
				{this.renderButtons()}
				<div className="errMsg">{error && error.message}</div>
			</div>
		);
	}

	renderCert = () => {
		const cert = this.state.cert;
		if (!cert) return <div></div>;

		const certData = cert.data.cert;
		const othersData = cert.data.others;
		const partData = cert.data.participant;

		const viewing = this.state.action === "viewing";

		return (
			<div className="CertSectionContent">
				{!viewing && this.renderSplit(cert)}
				{this.renderSection(cert, certData, Constants.TEMPLATES.DATA_TYPES.CERT)}
				{this.renderSection(cert, othersData, Constants.TEMPLATES.DATA_TYPES.OTHERS)}

				{partData.map((data, key) => {
					return (
						<div className="ParticipantContent" key={"part-" + key}>
							<div hidden={key === 0}>
								<button
									className="RemoveParticipantButton"
									hidden={this.state.viewing}
									onClick={() => this.removeParticipant(key)}
								>
									{Messages.EDIT.BUTTONS.REMOVE_PARTICIPANTS}
								</button>
							</div>
							{this.renderSection(cert, data)}
						</div>
					);
				})}
				<div>{"(* requerido)"}</div>
			</div>
		);
	};

	renderSplit = cert => {
		const allData = cert.data.cert
			.concat(cert.data.participant[0])
			.concat(cert.data.others)
			.map(dataElem => dataElem.name);

		return (
			<div className="Data">
				<div className="DataName">{Constants.CERTIFICATES.EDIT.SPLIT}</div>
				<div className="DataElem">
					<Select
						className="DataInput Boolean"
						autoFocus
						value={cert.split ? cert.split : false}
						onChange={event => {
							this.splitChanged(event.target.value);
						}}
					>
						<MenuItem className="DataInput" value={"true"}>
							{Constants.TEMPLATES.EDIT.BOOLEAN.TRUE}
						</MenuItem>
						<MenuItem className="DataInput" value={"false"}>
							{Constants.TEMPLATES.EDIT.BOOLEAN.FALSE}
						</MenuItem>
					</Select>
				</div>

				{cert.split && cert.microCredentials && cert.microCredentials.length > 0 && (
					<div className="MicroCreds">
						<div className="MicroCredsHeader">
							<div className="DataName MicroCredsNameLabel">{Messages.EDIT.DATA.MICRO_CRED_NAME}</div>
							<div className="DataName MicroCredsFieldsLabel">{Messages.EDIT.DATA.MICRO_CRED_FIELDS}</div>
						</div>
						{cert.microCredentials.map((microCred, key) => {
							let picked = [];
							for (let i = 0; i < cert.microCredentials.length; i++) {
								if (i !== key) picked = picked.concat(cert.microCredentials[i].names);
							}
							const data = allData.filter(microCredName => picked.indexOf(microCredName) < 0);
							return (
								<div className="DataElem" key={"Microcred-" + key}>
									<input
										type="text"
										className="DataInput MicroCredFieldName"
										value={microCred.title}
										onChange={event => {
											this.microcredNameChanged(key, event);
										}}
									/>
									<Select
										className="MicroCredFieldsSelect"
										multiple
										displayEmpty
										value={microCred.names}
										onChange={event => {
											this.microcredFieldsSelected(key, event);
										}}
										renderValue={selected => selected.join(", ")}
									>
										{data.map((elem, key2) => {
											return (
												<MenuItem key={"MicroCred-" + key + "-Fields-" + key2} value={elem}>
													<Checkbox checked={microCred.names.indexOf(elem) > -1} />
													<ListItemText primary={elem} />
												</MenuItem>
											);
										})}
									</Select>

									<button
										title={Messages.EDIT.BUTTONS.ADD_MICRO_CRED_LABEL}
										className="AddMicroCredential"
										onClick={this.addMicroCredential}
									>
										{Messages.EDIT.BUTTONS.ADD_MICRO_CRED}
									</button>
									<button
										title={Messages.EDIT.BUTTONS.REMOVE_MICRO_CRED_LABEL}
										hidden={key === 0}
										className="RemoveMicroCredential"
										onClick={() => {
											this.removeMicroCredential(key);
										}}
									>
										{Messages.EDIT.BUTTONS.REMOVE_MICRO_CRED}
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	};

	renderSection = (cert, data, type) => {
		const self = this;

		return (
			<div className="CertSectionContent">
				{data.map((dataElem, index) => {
					if (dataElem.name === Constants.TEMPLATES.MANDATORY_DATA.NAME)
						return <div key={"template-elem-" + index}></div>;

					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="DataName">{dataElem.name}</div>
							<div className="DataElem">
								{DataRenderer.renderData(
									dataElem,
									type,
									this.state.action === "creating" || this.state.action === "editing",
									(dataElem, value) => {
										dataElem.value = value;
										if (this.state.error) this.setState({ error: undefined });
										self.setState({ cert: cert });
									}
								)}
								<div className="RequiredMarker">{dataElem.required ? "*" : " "}</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	renderTemplateSelector = () => {
		const templates = this.state.templates;
		if (!templates) {
			return <div></div>;
		}

		return (
			<div className="TemplateSelector">
				<div className="DataName">{Constants.CERTIFICATES.EDIT.TEMPLATE_SELECT_MESSAGE}</div>

				<Autocomplete
					options={templates}
					getOptionLabel={option => (option ? option.name : "")}
					value={this.state.selectedTemplate ? this.state.selectedTemplate : ""}
					renderInput={params => <TextField {...params} variant="standard" label={""} placeholder="" fullWidth />}
					onChange={(_, value) => {
						this.templateSelected(value);
					}}
				/>
			</div>
		);
	};

	renderParticipantDialog = () => {
		const participants = this.state.participants;

		return (
			<Dialog open={this.state.isDialogOpen} onClose={this.onDialogClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{Messages.EDIT.DIALOG.PARTICIPANT.TITLE}</DialogTitle>
				<DialogContent>
					{participants && participants.length > 0 && <div>{Messages.QR.TEMPLATE_SELECT_MESSAGE}</div>}
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

					<div>{Messages.QR.QR_MESSAGE_CERT}</div>
					{this.renderQrPetition()}
				</DialogContent>
				<DialogActions>
					{participants && participants.length > 0 && (
						<Button onClick={this.onParticipantsAdd} color="primary">
							{Messages.EDIT.DIALOG.PARTICIPANT.CREATE}
						</Button>
					)}
					<Button onClick={this.onDialogClose} color="primary">
						{Messages.EDIT.DIALOG.PARTICIPANT.CLOSE}
					</Button>
				</DialogActions>
			</Dialog>
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

	renderButtons = () => {
		return (
			<div>
				<div className="AddParticipantButtons">
					<button
						className="AddParticipant"
						hidden={this.state.action === "viewing" || this.state.action === "editing"}
						onClick={this.addParticipant}
					>
						{Messages.EDIT.BUTTONS.ADD_PARTICIPANTS}
					</button>

					<button
						className="AddParticipant"
						hidden={this.state.action === "viewing" || this.state.action === "editing"}
						onClick={this.onDialogOpen}
					>
						{Messages.EDIT.BUTTONS.LOAD_PARTICIPANTS}
					</button>

					<button
						className="SampleCsv"
						hidden={this.state.action === "viewing" || this.state.action === "editing"}
						onClick={this.createSampleCsv}
					>
						{Messages.EDIT.BUTTONS.SAMPLE_CERT_FROM_CSV}
					</button>

					<ReactFileReader className="LoadCertFromCsv" handleFiles={this.loadCertFromCsv} fileTypes={".csv"}>
						<button hidden={this.state.action === "viewing" || this.state.action === "editing"}>
							{Messages.EDIT.BUTTONS.LOAD_CERT_FROM_CSV}
						</button>
					</ReactFileReader>
				</div>

				<div className="CertificateButtons">
					<button
						hidden={this.state.action === "viewing"}
						className="SaveButton"
						disabled={this.saveDisabled()}
						onClick={this.onSave}
					>
						{Messages.EDIT.BUTTONS.SAVE}
					</button>
					<button className="BackButton" onClick={this.onBack}>
						{Messages.EDIT.BUTTONS.BACK}
					</button>
					<button className="LogoutButton" onClick={this.onLogout}>
						{Messages.EDIT.BUTTONS.EXIT}
					</button>
				</div>
			</div>
		);
	};
}

export default withRouter(Certificate);
