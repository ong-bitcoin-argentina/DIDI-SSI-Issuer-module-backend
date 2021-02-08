import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Participants.scss";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import ReactFileReader from "react-file-reader";

import Spinner from "../utils/Spinner";
import QrDialog from "../utils/dialogs/QrDialog";

import TemplateService from "../../services/TemplateService";
import ParticipantService from "../../services/ParticipantService";
import Cookie from "js-cookie";

import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";
import { validateAccess } from "../../constants/Roles";
import DefaultButton from "../setting/default-button";
import InputDialog from "../utils/dialogs/InputDialog";
import RegisterService from "../../services/RegisterService";

let interval;
class Participants extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			requestSent: false,
			registers: []
		};
	}

	// parar pooling de participantes
	componentWillUnmount() {
		if (interval) {
			clearInterval(interval);
		}
	}

	// carga los participantes e inicializa el pooling de participantes
	componentDidMount() {
		const token = Cookie.get("token");
		const self = this;
		ParticipantService.getAllDids(
			token,
			function (dids) {
				self.setState({ dids: dids, error: false });
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);

		interval = setInterval(function () {
			if (self.state.requestSent) {
				self.props.onReload();
			}
		}, 10000);

		this.getAllRegister();
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

	// retorna true si hay algun elemento en la tabla seleccionado
	canSendRequest = loading => {
		if (loading) return false;

		const partIds = this.props.participants.map(part => part.did);
		const selectedParticipants = this.props.selectedParticipants;

		for (let partId of partIds) {
			for (let type of Object.keys(selectedParticipants)) {
				if (selectedParticipants[type][partId]) return true;
			}
		}
		return false;
	};

	// manda los pedidos correspondientes a los participantes/credenciales seleccionados
	sendRequests = ({ registerId }) => {
		const partIds = this.props.participants.map(part => part.did);
		const selectedParticipants = this.props.selectedParticipants;
		const requests = {};

		for (let partId of partIds) {
			for (let type of Object.keys(selectedParticipants)) {
				if (selectedParticipants[type][partId]) {
					if (!requests[partId]) requests[partId] = [];
					requests[partId].push(Constants.CERTIFICATES.REQUEST_TYPES[type]);
				}
			}
		}

		const token = Cookie.get("token");
		const self = this;

		for (let partId of Object.keys(requests)) {
			const globalRequestCode = Math.random().toString(36).slice(-8);

			if (self.reqSentDialog) self.reqSentDialog.open();

			// mandar pedido
			TemplateService.sendRequest(
				token,
				[partId],
				requests[partId],
				globalRequestCode,
				function (_) {
					self.setState({
						requestSent: true
					});
				},
				function (err) {
					self.setState({ error: err });
					console.log(err);
				},
				registerId
			);
		}
	};

	showSenRequestsPopUp = () => {
		this.reqSentDialog.open();
	};

	// generar csv de ejemplo para carga de participantes
	createSampleCsv = () => {
		const csv = "DID(ej:did:eth:0x5f6ed832a5fd0f0a58135f9695ea40af8666db31),NOMBRE(un texto)";

		const element = document.createElement("a");
		const file = new Blob([csv], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "sample.csv";
		document.body.appendChild(element);
		element.click();
	};

	// cargar participantes desde csv
	LoadDidsFromCsv = files => {
		const self = this;
		var reader = new FileReader();
		reader.onload = function (e) {
			const result = [];
			const data = reader.result.split(/[\r\n,]+/);

			let index = 2;
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

	// agrega los dids a partir de la info extraida del csv
	addDids = data => {
		const token = Cookie.get("token");
		const self = this;
		this.setState({ loading: true });
		ParticipantService.createNew(
			token,
			data,
			function (dids) {
				const local = self.state.dids;
				const acum = {};
				for (let did of dids) acum[did.did] = did.name;
				for (let did of local) acum[did.did] = did.name;

				const result = [];
				for (let key of Object.keys(acum)) {
					result.push({ did: key, name: acum[key] });
				}

				self.props.onReload();
				self.setState({ loading: false, dids: result, error: false });
			},
			function (err) {
				self.setState({ loading: false, error: err });
				console.log(err);
			}
		);
	};

	// volver a listado de credenciales
	onBack = () => {
		if (this.reqSentDialog) this.reqSentDialog.close();

		if (this.state.error) {
			this.setState({ loading: false, error: false });
		} else {
			if (this.qrDialog) this.qrDialog.close();
			this.setState({
				requestSent: false
			});
			this.componentDidMount();
		}
	};

	// mostrar pantalla de carga de participantes
	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const error = this.props.error || this.state.error;
		const loading = this.props.loading || this.state.loading;
		return (
			<div className={loading ? "QrReq Loading" : "QrReq"}>
				{Spinner.render(loading)}
				{this.renderCreateDialog()}
				{this.renderQrDialog()}
				{this.renderButtons(loading)}
				{error && <div className="errMsg">{error.message}</div>}
				{this.renderTable()}
			</div>
		);
	}

	// muestra el dialogo de carga de participantes por qr para modelo de credencial
	renderQrDialog = () => {
		return (
			<QrDialog
				loading={this.state.loading}
				onRef={ref => (this.qrDialog = ref)}
				title={Messages.EDIT.DIALOG.QR.LOAD_BY_QR}
				templates={this.props.templates}
			/>
		);
	};

	// muestra el dialogo para pedido enviado
	renderCreateDialog = () => {
		return (
			<InputDialog
				onRef={ref => (this.reqSentDialog = ref)}
				title={Messages.EDIT.DIALOG.QR.REQUEST_SENT}
				fieldNames={[]}
				selectNames={[
					{
						name: "registerId",
						label: "Emisor",
						options: this.state.registers
					}
				]}
				onAccept={this.sendRequests}
			/>
		);
	};

	// mostrar tabla de participantes
	renderTable = () => {
		const participants = this.props.participants;
		const columns = this.props.columns ? this.props.columns : [];

		return (
			<div className="ParticipantsTable">
				<ReactTable
					sortable={false}
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

	// mostrar botones al pie de la tabla
	renderButtons = loading => {
		return (
			<div className="QrRequestButtons my-2">
				{validateAccess(Constants.ROLES.Write_Dids_Registers) && (
					<>
						<div className="PartRequestRow">
							<button disabled={loading} className="CreateButton SampleCsv" onClick={this.createSampleCsv}>
								{Messages.EDIT.BUTTONS.SAMPLE_PART_FROM_CSV}
							</button>

							<ReactFileReader handleFiles={this.LoadDidsFromCsv} fileTypes={".csv"}>
								<button disabled={loading} className="CreateButton LoadDidsFromCsv">
									{Messages.EDIT.BUTTONS.LOAD_DIDS_FROM_CSV}
								</button>
							</ReactFileReader>

							<button
								className="CreateButton QrDialogButton"
								disabled={loading}
								onClick={() => {
									if (this.qrDialog) this.qrDialog.open();
								}}
							>
								{Messages.QR.BUTTONS.QR_LOAD}
							</button>
						</div>

						<div className="QrButtonsRow">
							{/* PartRequestButton */}
							<DefaultButton
								funct={this.showSenRequestsPopUp}
								disabled={!this.canSendRequest(loading)}
								name={Messages.QR.BUTTONS.REQUEST}
							/>
						</div>
					</>
				)}
			</div>
		);
	};
}

export default withRouter(Participants);
