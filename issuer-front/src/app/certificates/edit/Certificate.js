import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificate.css";

import CertificateService from "../../../services/CertificateService";
import TemplateService from "../../../services/TemplateService";

import DataRenderer from "../../utils/dataRenderer";

import Cookie from "js-cookie";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

class Certificate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isDialogOpen: false,
			loading: false
		};
	}

	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		self.setState({ loading: true });
		TemplateService.getAll(
			token,
			function(templates) {
				if (id) {
					CertificateService.get(
						token,
						id,
						function(cert) {
							const selectedTemplate = templates.find(template => template._id === cert.templateId);
							self.setState({
								selectedTemplate: selectedTemplate,
								cert: cert,
								templates: templates,
								loading: false
							});
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

	certFromTemplate = template => {
		const data = {
			cert: template.data.cert.map(data => {
				return {
					name: data.name,
					type: data.type,
					options: data.options,
					value: data.defaultValue ? data.defaultValue : "",
					required: data.required,
					mandatory: data.mandatory
				};
			}),
			participant: template.data.participant.map(data => {
				return {
					name: data.name,
					type: data.type,
					options: data.options,
					value: data.defaultValue ? data.defaultValue : "",
					required: data.required,
					mandatory: data.mandatory
				};
			}),
			others: template.data.others.map(data => {
				return {
					name: data.name,
					type: data.type,
					options: data.options,
					value: data.defaultValue ? data.defaultValue : "",
					required: data.required,
					mandatory: data.mandatory
				};
			})
		};

		return {
			templateId: template._id,
			data: data
		};
	};

	templateSelected = selectedTemplate => {
		const token = Cookie.get("token");

		const self = this;
		self.setState({ loading: true });
		TemplateService.get(
			token,
			selectedTemplate._id,
			function(template) {
				self.setState({ selectedTemplate: selectedTemplate, cert: self.certFromTemplate(template), loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

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

	onBack = () => {
		this.props.history.push(Constants.ROUTES.CERTIFICATES);
	};

	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
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
		const participantData = cert.data.participant;

		return (
			<div className="CertificateContent">
				{this.renderSection(cert, certData, Constants.TEMPLATES.DATA_TYPES.CERT)}
				{this.renderSection(cert, othersData, Constants.TEMPLATES.DATA_TYPES.OTHERS)}
				{this.renderSection(cert, participantData, Constants.TEMPLATES.DATA_TYPES.PARTICIPANT)}
			</div>
		);
	};

	renderSection = (cert, data, type) => {
		const self = this;
		return (
			<div className="CertSectionContent">
				{data.map((dataElem, index) => {
					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="DataName">{dataElem.name}</div>
							<div className="DataElem">
								{DataRenderer.renderData(
									dataElem,
									type,
									(data, value, type) => {
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
					className="DataDefault DataDefaultInput"
					autoFocus
					value={this.state.selectedTemplate ? this.state.selectedTemplate : this.state.templates[0]}
					onChange={event => {
						this.templateSelected(event.target.value);
					}}
				>
					{templates.map((opt, key) => {
						return (
							<MenuItem value={opt} key={"option-" + key} className="DataDefaultInput">
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
			<div className="CertificateButtons">
				<button className="SaveButton" onClick={this.onSave}>
					{Messages.EDIT.BUTTONS.SAVE}
				</button>
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

export default withRouter(Certificate);
