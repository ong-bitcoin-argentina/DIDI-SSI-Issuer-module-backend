import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificates.css";

import CertificateService from "../../../services/CertificateService";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Cookie from "js-cookie";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

class Certificates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			certificates: [],
			name: ""
		};
	}

	getCertificatesData = (self, cert) => {
		return {
			_id: cert._id,
			certName: cert.name,
			createdOn: cert.createdOn.split('T')[0],
			participantFirstName: cert.participant.name,
			participantLastName: cert.participant.lastName,
			actions: (
				<div className="Actions">
					<div
						className="EditAction"
						onClick={() => {
							self.onCertificateEdit(cert._id);
						}}
					>
						{Messages.LIST.BUTTONS.EDIT}
					</div>
					<div
						className="DeleteAction"
						onClick={() => {
							self.onCertificateDelete(cert._id);
						}}
					>
						{Messages.LIST.BUTTONS.DELETE}
					</div>
				</div>
			)
		};
	};

	componentDidMount() {
		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true });
		CertificateService.getAll(
			token,
			async function(certificates) {
				certificates = certificates.map(certificate => {
					return self.getCertificatesData(self, certificate);
				});
				self.setState({ certificates: certificates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	onCertificateDelete = id => {
		const token = Cookie.get("token");
		const self = this;

		self.setState({ loading: true });
		CertificateService.delete(
			token,
			id,
			async function(cert) {
				const certificates = self.state.certificates.filter(t => t._id !== cert._id);
				self.setState({ certificates: certificates, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	onCertificateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT + id);
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
			<div className="Certificates">
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}

	renderTable = () => {
		const certificates = this.state.certificates;
		const columns = [
			/*{
				Header: "Id",
				accessor: "_id"
			},*/
			{
				Header: Messages.LIST.TABLE.LAST_NAME,
				accessor: "participantLastName"
			},
			{
				Header: Messages.LIST.TABLE.NAME,
				accessor: "participantFirstName"
			},
			{
				Header: Messages.LIST.TABLE.CERT,
				accessor: "certName"
			},
			{
				Header: Messages.LIST.TABLE.EMISSION_DATE,
				accessor: "createdOn"
			},
			{
				Header: "",
				accessor: "actions"
			}
		];

		return (
			<div className="CertificateTable">
				<ReactTable
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={certificates}
					columns={columns}
					defaultPageSize={Constants.CERTIFICATES.TABLE.PAGE_SIZE}
					minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};

	renderButtons = () => {
		return (
			<button className="LogoutButton" onClick={this.onLogout}>
				{Messages.LIST.BUTTONS.EXIT}
			</button>
		);
	};
}

export default withRouter(Certificates);
