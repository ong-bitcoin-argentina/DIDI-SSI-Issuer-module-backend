import "./Lists.scss";
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";

import Cookie from "js-cookie";

import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Templates from "../templates/list/Templates";
import Certificates from "../certificates/list/Certificates";

import CertificateService from "../../services/CertificateService";
import TemplateService from "../../services/TemplateService";

class Lists extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			tabIndex: 0,
			certificates: [],
			templates: []
		};
	}

	// mapear certificados al formato requerido por "ReactTable"
	getTemplateData = template => {
		const self = this;
		return {
			_id: template._id,
			name: template.name,
			actions: (
				<div className="Actions">
					<div
						className="EditAction"
						onClick={() => {
							self.onTemplateEdit(template._id);
						}}
					>
						{Messages.LIST.BUTTONS.EDIT}
					</div>
					<div
						className="DeleteAction"
						onClick={() => {
							self.onTemplateDelete(template._id);
						}}
					>
						{Messages.LIST.BUTTONS.DELETE}
					</div>
				</div>
			)
		};
	};

	// mapear certificados al formato requerido por "ReactTable"
	getCertificatesData = cert => {
		const emmited = cert.emmitedOn;
		const self = this;

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
					{
						<div
							className="DeleteAction"
							onClick={() => {
								self.onCertificateDelete(cert._id);
							}}
						>
							{Messages.LIST.BUTTONS.DELETE}
						</div>
					}
				</div>
			)
		};
	};

	// cargar certificados
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
		const active = splitPath[splitPath.length - 1];
		let tabIndex = active === "certificates" ? 1 : 0;

		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true, tabIndex: tabIndex });
		TemplateService.getAll(
			token,
			async function(templates) {
				templates = templates.map(template => {
					return self.getTemplateData(template);
				});
				CertificateService.getAll(
					token,
					async function(certificates) {
						certificates = certificates.map(certificate => {
							return self.getCertificatesData(certificate);
						});
						self.setState({ templates: templates, certificates: certificates, loading: false });
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
	}

	// borrar certificados
	onCertificateDelete = id => {
		const token = Cookie.get("token");
		const self = this;

		const cert = self.state.certificates.find(t => t._id === id);
		cert.actions = <div></div>;

		self.setState({ cert: self.state.certificates });
		CertificateService.delete(
			token,
			id,
			async function(cert) {
				const certificates = self.state.certificates.filter(t => t._id !== cert._id);
				self.setState({ certificates: certificates });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// emitir certificados
	onCertificateEmmit = id => {
		const token = Cookie.get("token");
		const self = this;

		const cert = self.state.certificates.find(t => t._id === id);
		cert.actions = <div></div>;

		self.setState({ cert: self.state.certificates });
		CertificateService.emmit(
			token,
			id,
			async function(_) {
				self.componentDidMount();
			},
			function(err) {
				console.log(err);
				self.setState({ error: err });
			}
		);
	};

	// a pantalla de edicion
	onCertificateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	// crear templates
	onTemplateCreate = name => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		TemplateService.create(
			token,
			name,
			async function(template) {
				const templates = self.state.templates;
				templates.push(self.getTemplateData(template));
				self.setState({ templates: templates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// borrar templates
	onTemplateDelete = id => {
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		TemplateService.delete(
			token,
			id,
			async function(template) {
				const templates = self.state.templates.filter(t => t._id !== template._id);
				self.setState({ templates: templates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// a pantalla de edicion
	onTemplateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_TEMPLATE + id);
	};

	// a pantalla de login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		return (
			<Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
				<TabList>
					<Tab>{Messages.LIST.BUTTONS.TO_TEMPLATES}</Tab>
					<Tab>{Messages.LIST.BUTTONS.TO_CERTIFICATES}</Tab>
				</TabList>

				<TabPanel>
					<Templates
						selected={this.state.tabIndex}
						templates={this.state.templates}
						loading={this.state.loading}
						error={this.state.error}
						onTemplateCreate={this.onTemplateCreate}
						onLogout={this.onLogout}
					/>
				</TabPanel>
				<TabPanel>
					<Certificates
						selected={this.state.tabIndex}
						certificates={this.state.certificates}
						loading={this.state.loading}
						onCertificateDelete={this.onCertificateDelete}
						onCertificateEmmit={this.onCertificateEmmit}
						onCertificateCreate={this.onCertificateCreate}
						error={this.state.error}
						onLogout={this.onLogout}
					/>
				</TabPanel>
			</Tabs>
		);
	}
}

export default withRouter(Lists);
