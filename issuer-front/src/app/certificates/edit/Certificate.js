import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificate.scss";

import CertificateService from "../../../services/CertificateService";
import TemplateService from "../../../services/TemplateService";
import ParticipantService from "../../../services/ParticipantService";

import ReactFileReader from "react-file-reader";
import DataRenderer from "../../utils/DataRenderer";

import Cookie from "js-cookie";

import Constants, { DATE_FORMAT } from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Spinner from "../../utils/Spinner";
import Select from "@material-ui/core/Select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import logoApp from "../../../images/ai-di-logo.svg";
import moment from "moment";

import QrDialog from "../../utils/dialogs/QrDialog";

let interval;
class Certificate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			action: "viewing"
		};
	}

	// parar pooling de participante (espera respuestas del qr)
	componentWillUnmount() {
		if (interval) {
			clearInterval(interval);
		}
	}

	// cargar templates, credencial, etc
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		(async () => {
			self.setState({ loading: true });

			try {
				await self.getTemplates(token);
				if (id) {
					await self.getCert(token, id);
					await self.getTemplate(token);
					await self.getParticipants();
				}
			} catch (err) {
				self.setState({ error: err });
				console.log(err);
			}

			self.setState({ loading: false });
		})();
	}

	// carga modelos de credencial
	getTemplates = function (token) {
		const self = this;
		return new Promise(function (resolve, reject) {
			TemplateService.getAll(
				token,
				function (templates) {
					self.setState({ templates: templates });
					resolve();
				},
				function (err) {
					reject(err);
				}
			);
		});
	};

	// carga credencial
	getCert = function (token, id) {
		const self = this;
		return new Promise(function (resolve, reject) {
			CertificateService.get(
				token,
				id,
				function (cert) {
					self.setState({
						cert: cert,
						error: false
					});
					resolve();
				},
				function (err) {
					reject(err);
				}
			);
		});
	};

	// carga modelo de credencial
	getTemplate = function (token) {
		const self = this;

		// si el cert fue emitido, no puedo editarlo
		const action = this.state.cert.emmitedOn ? "viewing" : "editing";
		const selectedTemplate = this.state.templates.find(template => template._id === this.state.cert.templateId);

		return new Promise(function (resolve, reject) {
			TemplateService.get(
				token,
				selectedTemplate._id,
				function (template) {
					self.setState({
						action: action,
						selectedTemplate: selectedTemplate,
						template: template,
						error: false
					});
					resolve();
				},
				function (err) {
					reject(err);
				}
			);
		});
	};

	// carga lista de participantes de los que se tiene info para el modelo de credencial
	getParticipants = function () {
		const self = this;
		const token = Cookie.get("token");
		return new Promise(function (resolve, reject) {
			ParticipantService.getAll(
				token,
				self.state.template._id,
				function (participants) {
					self.setState({
						participants: participants,
						error: false
					});
					resolve();
				},
				function (err) {
					reject(err);
				}
			);
		});
	};

	// generar credencial a partir del template seleccionado en el combo
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

	// mapear data de la credencial a partir del modelo
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

	// respuesta del qr -> actualizar participante con los datos recibidos
	onDataReceived = parts => {
		this.onParticipantsAdd(parts);
	};

	// agregar info de participante con los datos por defecto del template
	addParticipant = () => {
		const participant = this.state.cert.data.participant;
		participant.push(this.certDataFromTemplate(this.state.template, "participant"));
		this.setState({ cert: this.state.cert });
	};

	// genera csv de ejemplo para carga por csv
	createSampleCsv = () => {
		const getSample = function (dataElem) {
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
						return "ej: did:ethr:0x5f6ed832a5fd0f0a58135f9695ea40af8666db31";
					return "un texto";
				case Constants.TEMPLATES.TYPES.PARAGRAPH:
					return "un parrafo";
				default:
					return "";
			}
		};

		let csv = "";
		let firstLine = "";

		const certData = this.state.cert.data.cert;
		for (let key of Object.keys(certData)) {
			if (!certData[key].mandatory) {
				csv += certData[key].name + " (" + getSample(certData[key]) + ")";
				csv += certData[key].required ? "*," : ",";
				firstLine += ",";
			}
		}

		const othersData = this.state.cert.data.others;
		if (othersData) {
			for (let key of Object.keys(othersData)) {
				if (!othersData[key].mandatory) {
					csv += othersData[key].name + " (" + getSample(othersData[key]) + ")";
					csv += othersData[key].required ? "*," : ",";
					firstLine += ",";
				}
			}
		}

		const partData = this.state.cert.data.participant[0];
		// for (let i = 0; i < 3; i++) {
		for (let key of Object.keys(partData)) {
			csv += partData[key].name + " (" + getSample(partData[key]) + ")";
			csv += partData[key].required ? "*," : ",";
			firstLine += ",";
		}
		//}

		//csv = csv.substring(0, csv.length - 1);
		firstLine = firstLine.substring(0, firstLine.length - 1);
		csv += "\n" + firstLine;

		const element = document.createElement("a");
		const file = new Blob([csv], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "sample.csv";
		document.body.appendChild(element);
		element.click();
	};

	// validar que el valor sea un did
	validateDID = function (value) {
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
		// retorna true si el dato es valido (valida segun el tipo de dato requerido en el modelo de credencial)
		let validateValueMatchesType = function (dataElem, value) {
			switch (dataElem.type) {
				case Constants.TEMPLATES.TYPES.BOOLEAN:
					dataElem.value = value;
					if (value === "TRUE") dataElem.value = true;
					if (value === "FALSE") dataElem.value = true;
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
						const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
						if (date instanceof Date && !isNaN(date)) {
							dataElem.value = date;
							return true;
						} else {
							return false;
						}
					} catch (err) {
						console.log(err);
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

		// asigna los datos a partir del csv, si en este hay datos validos que asignar
		let assignElement = function (dataElem, data) {
			if (data === "" || data === " ") {
				if (dataElem.required) return Constants.CERTIFICATES.ERR.CSV_REQUIRED_VALUE_MISSING(dataElem.name);
			} else {
				if (!validateValueMatchesType(dataElem, data)) {
					return Constants.CERTIFICATES.ERR.CSV_REQUIRED_VALUE_INVALID(dataElem.name);
				}
			}
		};

		const self = this;
		var reader = new FileReader();
		// iterar los campos de la credencial y asignar los valores correspondiente del csv
		reader.onload = function (e) {
			const participant = [];

			// remove first line (headers)
			let data = reader.result.split(/[\r\n]+/);
			data.shift();
			data = data.join(",");

			// get array from fields
			data = data.split(",");

			const certData = JSON.parse(JSON.stringify(self.state.cert.data.cert));
			const othersData = JSON.parse(JSON.stringify(self.state.cert.data.others));
			const partData = self.certDataFromTemplate(self.state.template, "participant");

			const certDataKeys = Object.keys(certData);
			const otherDataKeys = Object.keys(othersData);
			const partDataKeys = Object.keys(partData);

			const certDataCount = certDataKeys.length - 1;
			const otherDataCount = otherDataKeys.length;
			const partDataCount = partDataKeys.length;

			if (certDataCount + otherDataCount + partDataCount > data.length) {
				const err = Constants.CERTIFICATES.ERR.CSV_MISSING_FIELDS();
				return self.setState({ error: err });
			}

			let index = 0;

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
				const partData = self.certDataFromTemplate(self.state.template, "participant");
				for (let dataElem of partData) {
					if (data.length > index) {
						const err = assignElement(dataElem, data[index]);
						if (err) return self.setState({ error: err });
						if (dataElem.name === Constants.CERTIFICATES.MANDATORY_DATA.DID) self.validateDID(dataElem.value);
						index++;
					}
				}
				index += certDataCount + otherDataCount;
				participant.push(partData);
			} while (data.length - index >= partDataCount);

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
			function (template) {
				ParticipantService.getAll(
					token,
					template._id,
					function (participants) {
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
					function (err) {
						self.setState({ error: err });
						console.log(err);
					}
				);
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// busca la data del participante en issuer-back y lo carga en la posicion indicada dentro de la lista de participantes
	participantSelected(did, position) {
		const self = this;
		const token = Cookie.get("token");
		self.setState({ loading: true });

		ParticipantService.get(
			token,
			did,
			function (participant) {
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

					const didDataToUpdate = partToUpdate.find(data => data.name.toLowerCase() === "did");
					if (didDataToUpdate) didDataToUpdate.value = participant.did;
				}

				self.setState({
					participants: self.state.participants,
					error: false,
					action: self.state.action,
					loading: false
				});
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	// agrega todos los participantes en 'parts' a la lista de participantes
	onParticipantsAdd = parts => {
		const len = this.state.cert.data.participant.length;
		let pos = 0;

		if (parts.length === 0) return;

		for (let newPart of parts) {
			if (pos >= len) this.addParticipant();
			this.participantSelected(newPart.did, pos);
			pos++;
		}

		if (len >= pos) this.state.cert.data.participant.splice(pos, len - pos);
	};

	// guardar cert y volver a listado de credencial
	onSave = () => {
		const token = Cookie.get("token");
		const cert = this.state.cert;
		const self = this;

		self.setState({ loading: true });
		CertificateService.save(
			token,
			cert,
			async function (_) {
				self.setState({ loading: false, error: false });
				self.props.history.push(Constants.ROUTES.CERTIFICATES_PENDING);
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// agrega microcredencial a la lista de microcredenciales
	addMicroCredential = () => {
		const cert = this.state.cert;
		cert.microCredentials.push({ title: "", names: [] });
		this.setState({ cert: cert });
	};

	// borra microcredencial de la lista de microcredenciales
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

	// habilita o deshabilita microcredenciales
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

	// volver a listado de credencial
	onBack = () => {
		if (this.state.loading && this.state.error) {
			this.setState({ loading: false, error: false });
		} else {
			this.props.history.push(Constants.ROUTES.CERTIFICATES);
		}
	};

	updateErrorDelayed = error => {
		const self = this;
		// delay setState in case view is still rendering
		setTimeout(() => {
			if (!error || !this.state.error) {
				self.setState({ error: error });
			}
		}, 500);
	};

	// si el boton de guardar esta deshabilitado
	// (algun campo obligatorio sin llenar o el did tiene un formato incorrecto)
	saveDisabled = () => {
		if (!this.state.cert) return true;

		const did = this.state.cert.data.participant[0][0].value;
		const regex = /^did:ethr:0x[0-9A-Za-z]{40}$/;
		if (did && !did.match(regex)) {
			if (!this.state.error) this.updateErrorDelayed({ message: Constants.CERTIFICATES.ERR.INVALID_DID });
			return true;
		} else {
			if (this.state.error && this.state.error.message === Constants.CERTIFICATES.ERR.INVALID_DID)
				this.updateErrorDelayed(false);
		}

		const cert = this.state.cert.data.cert;
		const participant = this.state.cert.data.participant.flat();
		const others = this.state.cert.data.others;

		const all = cert.concat(participant).concat(others);
		for (let index in all) {
			const dataElem = all[index];
			if (dataElem.name === Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE) {
				if (new Date(dataElem.value) < new Date()) {
					if (!this.state.error) {
						this.updateErrorDelayed(Constants.CERTIFICATES.ERR.EXP_DATE_INVALID);
					}
					return true;
				} else {
					if (this.state.error && this.state.error.message === Constants.CERTIFICATES.ERR.EXP_DATE_INVALID.message)
						this.updateErrorDelayed(false);
				}
			}

			if (dataElem.required && !dataElem.value) {
				if (!this.state.error) {
					this.updateErrorDelayed(Constants.CERTIFICATES.ERR.MISSING_FIELD(dataElem.name));
				}
				return true;
			} else {
				if (
					this.state.error &&
					this.state.error.message === Constants.CERTIFICATES.ERR.MISSING_FIELD(dataElem.name).message
				) {
					this.updateErrorDelayed(false);
				}
			}
		}

		return false;
	};

	// obtener codigo qr a mostrar
	generateQrCode = () => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true, qr: undefined });

		const code = Math.random().toString(36).slice(-8);

		// obtener template
		TemplateService.getQrPetition(
			token,
			self.state.template._id,
			code,
			function (qr) {
				self.setState({
					requestCode: code,
					qr: qr,
					loading: false,
					qrSet: false,
					error: false
				});
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// mostrar pantalla de edicion de credencial
	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const { loading, error, cert } = this.state;

		return (
			<div className={loading ? "Certificate Loading" : "Certificate"}>
				<div className="Header">
					<img src={logoApp} alt="ai di logo" />
					<div className="Menu">
						<p>Menu</p>
					</div>
				</div>
				{Spinner.render(loading)}
				<div className="container">
					{this.renderTemplateSelector()}
					{!loading && this.renderCert()}
					{cert?.revocation && (
						<div class="errMsg">Esta Credencial fue revocada el {moment(cert.revocation.date).format(DATE_FORMAT)}</div>
					)}
					{this.renderQrDialog()}
					{this.renderButtons()}
					{error && <div className="errMsg">{error.message}</div>}
				</div>
			</div>
		);
	}

	// muestra el dialogo de carga de participantes por qr o previamente almacenados en didi-issuer
	renderQrDialog = () => {
		return (
			<QrDialog
				loading={this.state.loading}
				onRef={ref => (this.qrDialog = ref)}
				title={Messages.EDIT.DIALOG.QR.LOAD_BY_QR}
				onDataReceived={this.onDataReceived}
				template={this.state.template}
				templates={this.state.templates}
				participants={this.state.participants}
			/>
		);
	};

	// muestra la seccion de seleccion de microcredenciales
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

	// muestra la seccion de data de la credencial
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
			</div>
		);
	};

	// muestra datos de la credencial
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
								<div className="RequiredMarker">{dataElem.required ? " * " : "   "}</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	// mostrar selector de modelos de credencial
	renderTemplateSelector = () => {
		const templates = this.state.templates;
		if (!templates) {
			return <div></div>;
		}

		return (
			<div className="TemplateSelector">
				<div className="DataName">{Constants.CERTIFICATES.EDIT.TEMPLATE_SELECT_MESSAGE}</div>
				<h2>Editar Credencial</h2>
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

	// mostrar botones al pie de la tabla
	renderButtons = () => {
		return (
			<div className="AddParticipants">
				<div className="AddParticipantButtons">
					<button
						className="CertButton AddParticipant"
						hidden={this.state.action === "viewing" || this.state.action === "editing"}
						onClick={this.addParticipant}
					>
						{Messages.EDIT.BUTTONS.ADD_PARTICIPANTS}
					</button>

					<button
						className="CertButton LoadParticipant"
						hidden={this.state.action === "viewing" || this.state.action === "editing"}
						onClick={() => {
							if (this.qrDialog) this.qrDialog.open();
						}}
					>
						{Messages.EDIT.BUTTONS.LOAD_PARTICIPANTS}
					</button>

					<button
						className="CertButton SampleCsv"
						hidden={this.state.action === "viewing" || this.state.action === "editing"}
						onClick={this.createSampleCsv}
					>
						{Messages.EDIT.BUTTONS.SAMPLE_CERT_FROM_CSV}
					</button>

					<ReactFileReader handleFiles={this.loadCertFromCsv} fileTypes={".csv"}>
						<button className="CertButton" hidden={this.state.action === "viewing" || this.state.action === "editing"}>
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
				</div>
			</div>
		);
	};
}

export default withRouter(Certificate);
