import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificate.scss";

import CertificateService from "../../../services/CertificateService";
import TemplateService from "../../../services/TemplateService";

import ReactFileReader from "react-file-reader";
import DataRenderer from "../../utils/DataRenderer";

import Cookie from "js-cookie";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class Certificate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			action: "viewing"
		};
	}

	// cargar templates, certificado, etc
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		self.setState({ loading: true });
		// cargar templates
		TemplateService.getAll(
			token,
			function(templates) {
				if (id) {
					// cargar cert
					CertificateService.get(
						token,
						id,
						function(cert) {
							// si el cert fue emitido, no puedo editarlo
							const action = cert.emmitedOn ? "viewing" : "editing";
							const selectedTemplate = templates.find(template => template._id === cert.templateId);
							TemplateService.get(
								token,
								selectedTemplate._id,
								function(template) {
									self.setState({
										selectedTemplate: selectedTemplate,
										cert: cert,
										template: template,
										templates: templates,
										loading: false,
										action: action
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
				} else {
					self.setState({ templates: templates, loading: false });
				}
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

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
		this.setState({ cert: this.state.cert, error: { message: Constants.CERTIFICATES.ERR.INVALID_DID } });
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
					return "ej: 05 October 2011 14:48 UTC";
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
				csv += certData[key].name + "(" + getSample(certData[key]) + "),";
			}
		}

		const othersData = this.state.cert.data.others;
		if (othersData) {
			for (let key of Object.keys(othersData)) {
				if (!othersData[key].mandatory) {
					csv += othersData[key].name + "(" + getSample(othersData[key]) + "),";
				}
			}
		}

		const partData = this.state.cert.data.participant[0];
		for (let i = 0; i < 3; i++) {
			for (let key of Object.keys(partData)) {
				csv += partData[key].name + i + "(" + getSample(partData[key]) + "),";
			}
		}

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
					if ("" + value !== "true" && "" + value !== "false") return false;
					return true;
				case Constants.TEMPLATES.TYPES.CHECKBOX:
					return dataElem.options.find(elem => elem === value + "");
				case Constants.TEMPLATES.TYPES.DATE:
					try {
						const date = new Date(value);
						if (!date) return false;
						return true;
					} catch (err) {
						return false;
					}
				case Constants.TEMPLATES.TYPES.NUMBER:
					if (isNaN(value)) return false;
					return true;
				case Constants.TEMPLATES.TYPES.PARAGRAPH:
					if (!value) return false;
					return true;
				case Constants.TEMPLATES.TYPES.TEXT:
					if (!value) return false;
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
				dataElem.value = data;
			}
		};

		const self = this;
		var reader = new FileReader();
		reader.onload = function(e) {
			const participant = [];
			const data = reader.result.split(",");
			let index = 0;

			const certData = JSON.parse(JSON.stringify(self.state.cert.data.cert));
			for (let key of Object.keys(certData)) {
				const dataElem = certData[key];
				if (!dataElem.mandatory) {
					const err = assignElement(dataElem, data[index]);
					if (err) return self.setState({ error: err });
					index++;
				}
			}

			const othersData = JSON.parse(JSON.stringify(self.state.cert.data.others));
			for (let key of Object.keys(othersData)) {
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
				participant.push(participantData);
			} while (data.length > index);

			self.state.cert.data.cert = certData;
			self.state.cert.data.participant = participant;
			self.state.cert.data.others = othersData;

			self.setState({ cert: self.state.cert });
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
				self.setState({
					selectedTemplate: selectedTemplate,
					template: template,
					cert: self.certFromTemplate(template),
					error: { message: Constants.CERTIFICATES.ERR.INVALID_DID },
					loading: false,
					action: "creating"
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
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
				self.setState({ loading: false });
				self.props.history.push(Constants.ROUTES.CERTIFICATES);
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	splitChanged = value => {
		const cert = this.state.cert;
		cert.split = value;
		this.setState({ cert: cert });
	};

	// volver a listado de certificados
	onBack = () => {
		this.props.history.push(Constants.ROUTES.CERTIFICATES);
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
		if (!did.match(regex)) return true;

		const cert = this.state.cert.data.cert;
		const participant = this.state.cert.data.participant.flat();
		const others = this.state.cert.data.others;

		const all = cert.concat(participant).concat(others);
		for (let index in all) {
			const dataElem = all[index];
			if (dataElem.required && !dataElem.value) {
				return true;
			}
		}
		return false;
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const loading = this.state.loading;
		return (
			<div className="Certificate">
				{!loading && this.renderTemplateSelector()}
				{!loading && this.renderCert()}
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}

	renderCert = () => {
		const cert = this.state.cert;
		if (!cert) return <div></div>;

		const certData = cert.data.cert;
		const othersData = cert.data.others;
		const partData = cert.data.participant;

		return (
			<div className="CertSectionContent">
				{this.renderSplit(cert)}
				{this.renderSection(cert, certData, Constants.TEMPLATES.DATA_TYPES.CERT)}
				{this.renderSection(cert, othersData, Constants.TEMPLATES.DATA_TYPES.OTHERS)}

				{partData.map((data, key) => {
					return (
						<div className="ParticipantContent" key={"part-" + key}>
							<button
								className="RemoveParticipantButton"
								hidden={this.state.viewing}
								onClick={() => this.removeParticipant(key)}
							>
								{Messages.EDIT.BUTTONS.REMOVE_PARTICIPANTS}
							</button>
							{this.renderSection(cert, data, "hola")}
						</div>
					);
				})}
			</div>
		);
	};

	renderSplit = cert => {
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

					{/* TODO seleccionar campos para microcredenciales
					 cert.split && (
						<Select
							className="MicroCredFieldsSelect"
							multiple
							displayEmpty
							value={this.state.cert.microCredentials[0].names}
							onChange={this.microcredFieldsSelected}
							renderValue={selected => selected.join(", ")}
						>
							{templateElements.map((elem, key) => {
								return (
									<MenuItem key={"PreviewFields-" + key} value={elem}>
										<Checkbox checked={this.state.template.previewData.indexOf(elem) > -1} />
										<ListItemText primary={elem} />
									</MenuItem>
								);
							})}
						</Select>
						) */}
				</div>
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
										if (dataElem.name === Constants.CERTIFICATES.MANDATORY_DATA.DID) self.validateDID(value);

										dataElem.value = value;
										self.setState({ cert: cert });
									}
								)}
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
				<div className="DataName">{Constants.CERTIFICATES.EDIT.TEMPLATE_SELECT}</div>
				<Select
					className="DataInput"
					autoFocus
					value={this.state.selectedTemplate ? this.state.selectedTemplate : this.state.templates[0]}
					onChange={event => {
						this.templateSelected(event.target.value);
					}}
				>
					{templates.map((opt, key) => {
						return (
							<MenuItem value={opt} key={"option-" + key} className="DataInput">
								{opt.name}
							</MenuItem>
						);
					})}
				</Select>
			</div>
		);
	};

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
