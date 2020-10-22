import "./Main.scss";
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";

import Cookie from "js-cookie";

import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Templates from "../templates/list/Templates";
import TemplateTableHelper from "../templates/list/TemplateTableHelper";

import Certificates from "../certificates/list/Certificates";
import CertificateTableHelper from "../certificates/list/CertificateTableHelper";

import Participants from "../participants/Participants";
import ParticipantsTableHelper from "../participants/ParticipantsTableHelper";

import CertificateService from "../../services/CertificateService";
import TemplateService from "../../services/TemplateService";
import ParticipantService from "../../services/ParticipantService";

import Delegates from "../administrative/list/Delegates";
import DelegateService from "../../services/DelegateService";
import DelegatesTableHelper from "../administrative/list/DelegatesTableHelper";

import InputDialog from "../utils/dialogs/InputDialog";

import CertificatesEmmited from "../certificates/emmited/CertificatesEmmited";
import CertificatesRevoked from "../certificates/revoked/CertificatesRevoked";
import Header from "../components/Header";

const TABS = {
  list: 0,
	templates: 0,
	"certificates-pending": 1,
	certificates: 2,
	"certificates-revoked": 3,
	registry: 4,
	delegated: 5
};

const {
	TO_CERTIFICATES,
	TO_REVOKED_CERTIFICATES,
	TO_QR,
	TO_TEMPLATES,
	DELEGATES,
	TO_CERTIFICATES_PENDING
} = Messages.LIST.BUTTONS;

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			showMenu: false,
			tabIndex: 1,
			partTypes: ["tel", "mail", "personal", "address"],
			parts: [],
			allSelectedParticipants: {
				tel: false,
				mail: false,
				personal: false,
				address: false
			},
			selectedParticipants: {
				tel: {},
				mail: {},
				personal: {},
				address: {}
			},
			allSelectedCerts: false,
			anchorEl: null,
			selectedCerts: {},
			certificates: [],
			filteredCertificates: [],
			templates: [],
			delegates: [],
			delegateColumns: []
		};
	}

	// cargar credenciales
	componentDidMount() {
		const splitPath = this.props.history.location.pathname.split("/");
    const path = splitPath[splitPath.length - 1];
		let tabIndex = TABS[path];

		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true, tabIndex });
		ParticipantService.getGlobal(
			token,
			async function (parts) {
				const allSelectedParticipants = self.state.allSelectedParticipants;
				const selectedParticipants = self.state.selectedParticipants;
				self.updateSelectedParticipantsState(parts, selectedParticipants, allSelectedParticipants);

				TemplateService.getAll(
					token,
					async function (templates) {
						templates = templates.map(template => {
							return TemplateTableHelper.getTemplateData(
								template,
								self.onTemplateEdit,
								self.onTemplateDeleteDialogOpen,
								() => self.state.loading
							);
						});
						const templateColumns = TemplateTableHelper.getTemplateColumns(templates);
						self.setState({
							templates: templates,
							templateColumns: templateColumns
						});
						CertificateService.getAll(
							token,
							async function (certs) {
								const selectedCerts = self.state.selectedCerts;
								self.updateSelectedCertsState(certs, selectedCerts);

								DelegateService.getAll(
									token,
									async function (delegates) {
										delegates = delegates.map(delegate => {
											return DelegatesTableHelper.getDelegatesData(
												delegate,
												self.onDelegateDeleteDialogOpen,
												() => self.state.loading
											);
										});
										const delegateColumns = DelegatesTableHelper.getDelegatesColumns();

										self.setState({
											delegateColumns: delegateColumns,
											delegates: delegates,
											error: false,
											loading: false
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

		DelegateService.getIssuerName(
			token,
			function (name) {
				self.setState({
					issuerName: name
				});
			},
			function (err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	// seleccionar credencial a pedir para el participante
	onParticipantSelectToggle = (id, type, value) => {
		const allSelectedParticipants = this.state.allSelectedParticipants;
		const selectedParticipants = this.state.selectedParticipants;
		selectedParticipants[type][id] = value;
		this.updateSelectedParticipantsState(this.state.parts, selectedParticipants, allSelectedParticipants);
	};

	// seleccionar credencial a pedir para todos los participantes
	onParticipantSelectAllToggle = (type, value) => {
		const parts = this.state.parts;
		const allSelectedParticipants = this.state.allSelectedParticipants;
		const selectedParticipants = this.state.selectedParticipants;

		parts.forEach(part => {
			if (!part[type]) selectedParticipants[type][part.did] = value;
		});
		allSelectedParticipants[type] = value;
		this.updateSelectedParticipantsState(parts, selectedParticipants, allSelectedParticipants);
	};

	// actualizar seleccion de credenciales a pedir para participantes
	updateSelectedParticipantsState = (parts, selectedParts, allSelectedParticipants) => {
		const types = this.state.partTypes;
		parts.forEach(part => {
			types.forEach(type => {
				if (!part[type] && !selectedParts[type][part.did]) selectedParts[type][part.did] = false;
			});
		});

		types.forEach(type => {
			allSelectedParticipants[type] = true;
			for (let did of Object.keys(selectedParts[type])) {
				if (!selectedParts[type][did]) {
					allSelectedParticipants[type] = false;
				}
			}
		});

		this.setState({
			selectedParticipants: selectedParts,
			allSelectedParticipants: allSelectedParticipants
		});

		const participants = parts.map(participant => {
			return ParticipantsTableHelper.getParticipantData(
				participant,
				this.state.selectedParticipants,
				this.onParticipantSelectToggle,
				() => this.state.loading
			);
		});

		const participantColumns = ParticipantsTableHelper.getParticipantColumns(
			this.state.selectedParticipants,
			this.state.allSelectedParticipants,
			this.onParticipantSelectAllToggle,
			() => this.state.loading
		);

		this.setState({
			parts: parts,
			participants: participants,
			participantColumns: participantColumns
		});
	};

	// recargar tabla de participantes
	onParticipantsReload = () => {
		const self = this;
		const token = Cookie.get("token");
		self.setState({ loading: true });
		ParticipantService.getGlobal(
			token,
			async function (parts) {
				const allSelectedParticipants = self.state.allSelectedParticipants;
				const selectedParticipants = self.state.selectedParticipants;
				self.updateSelectedParticipantsState(parts, selectedParticipants, allSelectedParticipants);

				self.setState({
					error: false,
					loading: false
				});
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	// abrir dialogo de confirmacion para revocacion de credenciales
	onCertificateRevoke = id => {
		if (this.certificatesSection) {
			this.setState({ selectedCertId: id });
			this.certificatesSection.openRevokeDialog();
		}
	};

	// abrir dialogo de confirmacion para borrado de credenciales
	onCertificateDeleteDialogOpen = id => {
		if (this.certificatesSection) {
			this.setState({ selectedCertId: id });
			this.certificatesSection.openDeleteDialog();
		}
	};

	// borrar credenciales
	onCertificateDelete = () => {
		const id = this.state.selectedCertId;
		const token = Cookie.get("token");
		const self = this;

		const cert = self.state.certificates.find(t => t._id === id);
		cert.actions = <div></div>;
		cert.select = <div></div>;

		self.setState({ certs: self.state.certificates, loading: true });
		CertificateService.delete(
			token,
			id,
			async function (cert) {
				const certs = self.state.certs.filter(t => t._id !== cert._id);

				self.setState({
					certs: certs,
					loading: false,
					error: false
				});

				self.onCertificateSelectAllToggle(false);
			},
			function (err) {
				self.setState({ error: err, loading: false });
				console.log(err);
			}
		);
	};

	// selecciionar credenciales para emision multiple
	onCertificateSelectToggle = (certId, value) => {
		const certs = this.state.certs;
		const allSelectedCerts = this.state.allSelectedCerts;
		const selectedCerts = this.state.selectedCerts;
		selectedCerts[certId] = value;
		this.updateSelectedCertsState(certs, selectedCerts, allSelectedCerts);
	};

	// seleccionar todos los credenciales para emitirlos
	onCertificateSelectAllToggle = value => {
		let allSelectedCerts = this.state.allSelectedCerts;
		const certs = this.state.certs;
		const selectedCerts = this.state.selectedCerts;
		certs.forEach(cert => {
			if (!cert["emmitedOn"]) selectedCerts[cert._id] = value;
		});
		allSelectedCerts = value;
		this.updateSelectedCertsState(certs, selectedCerts, allSelectedCerts);
	};

	onRenameModalOpen = () => {
		if (this.renameDialog) this.renameDialog.open();
	};

	// actualizar seleccion de credenciales a emitir
	updateSelectedCertsState = (certs, selectedCerts) => {
		let allSelected = true;
		certs.forEach(cert => {
			if (!cert["emmitedOn"] && !selectedCerts[cert._id]) {
				selectedCerts[cert._id] = false;
				allSelected = false;
			}
		});

		this.setState({
			selectedCerts: selectedCerts,
			allSelectedCerts: allSelected
		});

		const filteredCerts = certs.filter(item => !item.emmitedOn);

		const certificates = filteredCerts.map(certificate => {
			return CertificateTableHelper.getCertificatesPendingData(
				certificate,
				selectedCerts,
				this.onCertificateSelectToggle,
				this.onCertificateEmmit,
				this.onCertificateEdit,
				this.onCertificateDeleteDialogOpen,
				() => this.state.loading
			);
		});

		const certColumns = CertificateTableHelper.getCertColumns(
			certificates,
			selectedCerts,
			allSelected,
			this.onCertificateSelectAllToggle,
			this.onTemplateFilterChange,
			this.onFirstNameFilterChange,
			this.onLastNameFilterChange,
			() => this.state.loading
		);

		this.setState({
			certs: certs,
			certificates: certificates,
			filteredCertificates: certificates,
			certColumns: certColumns
		});
	};

	// emitir credenciales marcados para emision multiple
	onCertificateMultiEmmit = () => {
		const keys = Object.keys(this.state.selectedCerts);
		const toEmmit = keys.filter(key => this.state.selectedCerts[key]);

		if (toEmmit.length === 0) return;

		const certs = this.state.certificates.filter(t => toEmmit.indexOf(t._id) > -1);
		certs.forEach(cert => {
			cert.actions = <div></div>;
			cert.selected = <div></div>;
		});

		this.setState({ certs: this.state.certificates, loading: true });

		const token = Cookie.get("token");
		const self = this;

		let errors = [];
		const promises = toEmmit.map(elem => {
			return new Promise(function (resolve, reject) {
				CertificateService.emmit(
					token,
					elem,
					async function (_) {
						resolve();
					},
					function (err) {
						errors.push(err.message);
						resolve();
					}
				);
			});
		});

		Promise.all(promises)
			.then(function () {
				if (errors.length) {
					let err = {};
					err.message = (
						<ul>
							{errors.map((error, key) => (
								<li key={"err-" + key} className="errorList">
									{error}
								</li>
							))}
						</ul>
					);

					self.setState({ error: err, loading: false });
				} else {
          self.setState({ tabIndex: 2, error: false, loading: false  });
				}
			})
			.catch(function (err) {
				self.setState({ error: err, loading: false });
			});
	};

	// emitir credenciales
	onCertificateEmmit = id => {
		const token = Cookie.get("token");
		const self = this;

		const cert = self.state.certificates.find(t => t._id === id);
		cert.actions = <div></div>;
		cert.select = <div></div>;

		self.setState({ certs: self.state.certificates, loading: true });
		CertificateService.emmit(
			token,
			id,
			async function (_) {
        self.setState({ tabIndex: 2, error: false, loading: false  });
			},
			function (err) {
				console.log(err);
				self.setState({ error: err, loading: false });
			}
		);
	};

	// a pantalla de edicion
	onCertificateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	// crear templates
	onTemplateCreate = data => {
		const name = data.name;
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		TemplateService.create(
			token,
			name,
			async function (template) {
				const templates = self.state.templates;
				const data = TemplateTableHelper.getTemplateData(
					template,
					self.onTemplateEdit,
					self.onTemplateDeleteDialogOpen,
					() => self.state.loading
				);
				templates.push(data);

				const templateColumns = TemplateTableHelper.getTemplateColumns(templates);
				self.setState({ templates: templates, templateColumns: templateColumns, loading: false, error: false });
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	// abrir dialogo de borrado
	onTemplateDeleteDialogOpen = id => {
		if (this.templatesSection) {
			this.setState({ selectedTemplateId: id });
			this.templatesSection.openDeleteDialog();
		}
	};

	// borrar templates
	onTemplateDelete = () => {
		const id = this.state.selectedTemplateId;
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		TemplateService.delete(
			token,
			id,
			async function (template) {
				const templates = self.state.templates.filter(t => t._id !== template._id);
				self.setState({ templates: templates, loading: false, error: false });
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	// filtro por nombre
	onFirstNameFilterChange = event => {
		const filter = event.target.value;
		this.updateFiltererCertificates(filter, this.state.lastNameFilter, this.state.templateFilter);
		this.setState({ firstNameFilter: filter });
	};

	// filtro por apellido
	onLastNameFilterChange = event => {
		const filter = event.target.value;
		this.updateFiltererCertificates(this.state.firstNameFilter, filter, this.state.templateFilter);
		this.setState({ lastNameFilter: filter });
	};

	// filtro por modelo de credencial
	onTemplateFilterChange = event => {
		const filter = event.target.value;
		this.updateFiltererCertificates(this.state.firstNameFilter, this.state.lastNameFilter, filter);
		this.setState({ templateFilter: filter });
	};

	// actualizar tabla en funcion de los filtros
	updateFiltererCertificates = (firstNameFilter, lastNameFilter, templateFilter) => {
		let cert = this.state.certificates;

		if (firstNameFilter && firstNameFilter !== "") {
			cert = cert.filter(certData => {
				return certData.firstName.toLowerCase().includes(firstNameFilter.toLowerCase());
			});
		}

		if (lastNameFilter && firstNameFilter !== "") {
			cert = cert.filter(certData => {
				return certData.lastName.toLowerCase().includes(lastNameFilter.toLowerCase());
			});
		}

		if (templateFilter) {
			cert = cert.filter(certData => {
				return certData.certName.toLowerCase().includes(templateFilter.toLowerCase());
			});
		}

		// cert = cert.filter(item => item.createdOn === "-");

		this.setState({ filteredCertificates: cert });
	};

	// a pantalla de edicion
	onTemplateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_TEMPLATE + id);
	};

	// abrir dialogo de borrado
	onDelegateDeleteDialogOpen = did => {
		if (this.delegatesSection) {
			this.setState({ selectedDelegateDid: did });
			this.delegatesSection.openDeleteDialog();
		}
	};

	// crear delegacion
	onDelegateCreate = data => {
		const did = data.did;
		const name = data.name;

		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		DelegateService.create(
			token,
			did,
			name,
			async function (delegate) {
				const delegates = self.state.delegates;
				const data = DelegatesTableHelper.getDelegatesData(
					delegate,
					self.onDelegateDeleteDialogOpen,
					() => self.state.loading
				);
				delegates.push(data);
				const delegateColumns = DelegatesTableHelper.getDelegatesColumns();
				self.setState({ delegates: delegates, delegateColumns: delegateColumns, loading: false, error: false });
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	// borrar delegacion
	onDelegateDelete = () => {
		const did = this.state.selectedDelegateDid;

		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		DelegateService.delete(
			token,
			did,
			async function (delegate) {
				const delegates = self.state.delegates.filter(t => t.did !== delegate.did);
				self.setState({ delegates: delegates, loading: false, error: false, selectedDelegateDid: undefined });
			},
			function (err) {
				self.setState({ loading: false, error: err, selectedDelegateDid: undefined });
				console.log(err);
			}
		);
	};

	// renombrar issuer (nombre que aparecera en los credenciales emitidos)
	onIssuerRename = data => {
		const name = data.name;
		const token = Cookie.get("token");
		const self = this;
		self.setState({ loading: true });
		DelegateService.changeIssuerName(
			token,
			name,
			async function (name) {
				self.setState({ loading: false, error: false, issuerName: name });
			},
			function (err) {
				self.setState({ loading: false, error: err, selectedDelegateDid: undefined });
				console.log(err);
			}
		);
	};

	// a pantalla de login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// mostrar pantalla principal con tabs para las distintas secciones
	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const { loading, tabIndex, error, anchorEl } = this.state;
		const selectedIndex = tabIndex ?? 0;

		return (
			<div className="MainContent">
				<Header onRenameModalOpen={this.onRenameModalOpen} />
				<Tabs selectedIndex={selectedIndex} onSelect={tabIndex => this.setState({ tabIndex, error: false })}>
					{this.renderRenameDialog()}
					{this.renderActions(loading)}

					<TabList>
						<Tab disabled={loading && tabIndex !== 0}>{TO_TEMPLATES}</Tab>
						<Tab disabled={loading && tabIndex !== 1}>{TO_CERTIFICATES_PENDING}</Tab>
						<Tab disabled={loading && tabIndex !== 2}>{TO_CERTIFICATES}</Tab>
						<Tab disabled={loading && tabIndex !== 3}>{TO_REVOKED_CERTIFICATES}</Tab>
						<Tab disabled={loading && tabIndex !== 4}>{TO_QR}</Tab>
						<Tab disabled={loading && tabIndex !== 5}>{DELEGATES}</Tab>
					</TabList>

					<TabPanel>
						<Templates
							onRef={ref => (this.templatesSection = ref)}
							selected={tabIndex === 0}
							templates={this.state.templates}
							columns={this.state.templateColumns}
							loading={loading}
							error={error}
							onCreate={this.onTemplateCreate}
							onDelete={this.onTemplateDelete}
						/>
					</TabPanel>
					<TabPanel>
						<Certificates
							onRef={ref => (this.certificatesSection = ref)}
							selected={tabIndex === 1}
							certificates={this.state.filteredCertificates}
							columns={this.state.certColumns}
							loading={loading}
							onMultiEmmit={this.onCertificateMultiEmmit}
							onDelete={this.onCertificateDelete}
							error={error}
						/>
					</TabPanel>
					<TabPanel>
						<CertificatesEmmited />
					</TabPanel>
					<TabPanel>
						<CertificatesRevoked />
					</TabPanel>
					<TabPanel>
						<Participants
							selected={this.state.tabIndex === 4}
							loading={loading}
							templates={this.state.templates}
							participants={this.state.participants}
							columns={this.state.participantColumns}
							error={error}
							onReload={this.onParticipantsReload}
							selectedParticipants={this.state.selectedParticipants}
						/>
					</TabPanel>

					<TabPanel>
						<Delegates
							onRef={ref => (this.delegatesSection = ref)}
							loading={loading}
							selected={this.state.tabIndex === 5}
							delegates={this.state.delegates}
							columns={this.state.delegateColumns}
							onRename={this.onIssuerRename}
							onCreate={this.onDelegateCreate}
							onDelete={this.onDelegateDelete}
							issuerName={this.state.issuerName}
							error={error}
						/>
					</TabPanel>
				</Tabs>
			</div>
		);
	}

	// muestra el dialogo de cambio de nombre para el issuer
	renderRenameDialog = () => {
		return (
			<InputDialog
				onRef={ref => (this.renameDialog = ref)}
				title={Messages.LIST.DIALOG.ISSUER_RENAME_TITLE(this.state.issuerName)}
				fieldNames={["name"]}
				onAccept={this.onIssuerRename}
			/>
		);
	};

	toggleShowMenu = () => {
		this.setState({ showMenu: !this.state.showMenu });
	};

	// mostrar botones al pie de la tabla
	renderActions = loading => {
		const showMenu = this.state.showMenu;
		return (
			<div className="ActionsMenu">
				<button onClick={this.toggleShowMenu}>{Messages.LIST.MENU.TITLE}</button>
				{false && (
					<div className="ActionsMenuItems">
						<button
							disabled={loading}
							onClick={() => {
								if (this.renameDialog) this.renameDialog.open();
							}}
						>
							{Messages.EDIT.BUTTONS.RENAME_ISSUER}
						</button>
						<button onClick={this.onLogout}>{Messages.EDIT.BUTTONS.EXIT}</button>
					</div>
				)}
			</div>
		);
	};
}

export default withRouter(Main);
