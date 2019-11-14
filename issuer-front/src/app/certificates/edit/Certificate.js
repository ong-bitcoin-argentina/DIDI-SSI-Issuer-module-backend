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
					required: data.required
				};
			}),
			participant: template.data.participant.map(data => {
				return {
					name: data.name,
					type: data.type,
					options: data.options,
					value: data.defaultValue ? data.defaultValue : "",
					required: data.required
				};
			}),
			others: template.data.others.map(data => {
				return {
					name: data.name,
					type: data.type,
					options: data.options,
					value: data.defaultValue ? data.defaultValue : "",
					required: data.required
				};
			})
		};

		return {
			templateId: template._id,
			name: "",
			participant: {
				name: "",
				lastName: ""
			},
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

		const participantData = [
			{ name: Constants.CERTIFICATES.PARTICIPANT.NAME, value: cert.participant.name, required: true },
			{ name: Constants.CERTIFICATES.PARTICIPANT.LAST_NAME, value: cert.participant.lastName, required: true }
		];

		return (
			<div className="CertificateContent">
				{this.renderSection(cert, cert.data.cert, Constants.TEMPLATES.DATA_TYPES.CERT)}
				{this.renderSection(
					cert,
					[...cert.data.participant, ...participantData],
					Constants.TEMPLATES.DATA_TYPES.PARTICIPANT
				)}
				{this.renderSection(cert, cert.data.others, Constants.TEMPLATES.DATA_TYPES.OTHERS)}
			</div>
		);
	};

	renderSection = (cert, data, type) => {
		return (
			<div className="CertSectionContent">
				{data.map((dataElem, index) => {
					return (
						<div className="Data" key={"template-elem-" + index}>
							<div className="DataName">{dataElem.name}</div>
							<div className="DataElem">
								{DataRenderer.renderData(dataElem, type, (data, value, type) => {
									if (type === Constants.TEMPLATES.DATA_TYPES.PARTICIPANT) {
										if (data.name === Constants.CERTIFICATES.PARTICIPANT.NAME) cert.participant.name = value;
										if (data.name === Constants.CERTIFICATES.PARTICIPANT.LAST_NAME) cert.participant.lastName = value;
									}

									dataElem.value = value;
									this.setState({ cert: cert });
								})}
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
			<Select
				className="DataDefault DataDefaultInput TemplateSelector"
				autoFocus
				value={this.state.selectedTemplate}
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
		);
	};

	renderButtons = () => {
		return (
			<div className="CertificateButtons">
				<button className="backButton" onClick={this.onBack}>
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
