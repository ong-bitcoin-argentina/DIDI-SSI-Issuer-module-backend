import React, { Component } from "react";
import { withRouter } from "react-router";
import "./Certificates.scss";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Spinner from "../../utils/Spinner";
import ConfirmationDialog from "../../utils/dialogs/ConfirmationDialog";
import MaterialIcon from "material-icons-react";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import DeleteAllCertsDialog from "./delete-all-certs-dialog";
import { validateAccess } from "../../../constants/Roles";
import DefaultButton from "../../setting/default-button";

const { EMMIT_SELECTED, DELETE_SELECETED } = Messages.LIST.BUTTONS;

class Certificates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: ""
		};
	}

	// generar referencia para abrirlo desde el padre
	componentDidMount() {
		this.props.onRef(this);
	}

	// borrar referencia
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	// a pantalla de edicion
	onCertificateEdit = id => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT + id);
	};

	// a pantalla de edicion
	onCertificateCreate = () => {
		this.props.history.push(Constants.ROUTES.EDIT_CERT);
	};

	// abrir dialogo de borrado de modelos
	openDeleteDialog = () => {
		if (this.deleteDialog) this.deleteDialog.open();
	};

	// abrir dialogo de borrado de modelos
	openRevokeDialog = () => {
		if (this.revokeDialog) this.revokeDialog.open();
	};

	// mostrar pantalla de credencial
	render() {
		const error = this.props.error || this.state.error;
		const loading = this.props.loading;
		return (
			<div className={loading ? "Certificates Loading" : "Certificates"}>
				{Spinner.render(loading)}
				{this.renderDeleteDialog()}
				{this.renderDeleteAllDialog()}
				{this.renderRevocationDialog()}
				{this.renderSectionButtons(loading)}
				{error && <div className="errMsg">{error.message}</div>}
				{this.renderTable()}
			</div>
		);
	}

	setOpenDeleteAll = value => {
		this.setState({ openDeleteAll: value });
	};

	renderDeleteAllDialog = () => {
		return (
			<DeleteAllCertsDialog
				onDeleteSelects={this.props.onDeleteSelects}
				selectedCerts={this.props.selectedCerts}
				openDeleteAll={this.state.openDeleteAll || false}
				setOpenDeleteAll={this.setOpenDeleteAll}
				allCertificates={this.props.allCertificates}
			/>
		);
	};

	// muestra el dialogo de borrado
	renderDeleteDialog = () => {
		return (
			<ConfirmationDialog
				onRef={ref => (this.deleteDialog = ref)}
				title={Messages.LIST.DIALOG.DELETE_CERT_TITLE}
				message={Messages.LIST.DIALOG.DELETE_CONFIRMATION("la Credencial")}
				confirm={Messages.LIST.DIALOG.DELETE}
				onAccept={this.props.onDelete}
			/>
		);
	};

	// muestra el dialogo de revocacion
	renderRevocationDialog = () => {
		return (
			<ConfirmationDialog
				onRef={ref => (this.revokeDialog = ref)}
				title={Messages.LIST.DIALOG.REVOKE_CERT_TITLE}
				message={Messages.LIST.DIALOG.REVOKE_CONFIRMATION}
				confirm={Messages.LIST.DIALOG.REVOKE}
				onAccept={this.props.onDelete}
			/>
		);
	};

	// muestra boton de creacion de credencial
	renderSectionButtons = loading => {
		return (
			<div className="HeadButtons">
				{this.renderButtons(loading)}
				{validateAccess(Constants.ROLES.Write_Certs) && (
					<button disabled={loading} className="CreateButton" onClick={this.onCertificateCreate}>
						<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
						<div className="CreateButtonText EmmitCertText">{Messages.LIST.BUTTONS.CREATE_CERT}</div>
					</button>
				)}
			</div>
		);
	};

	// muestra tabla de credencial
	renderTable = () => {
		const certificates = this.props.certificates;
		const columns = this.props.columns ?? [];

		return (
			<div className="CertificateTable">
				<ReactTable
					sortable={false}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={certificates}
					columns={columns}
					defaultPageSize={Constants.CERTIFICATES.TABLE.PAGE_SIZE}
					minRows={Constants.CERTIFICATES.TABLE.MIN_ROWS}
					style={{ textAlign: "center" }}
				/>
			</div>
		);
	};

	openDeleteAllDialog = () => {
		this.setState({ openDeleteAll: true });
	};

	// mostrar botones al pie de la tabla
	renderButtons = loading => {
		return (
			<>
				{validateAccess(Constants.ROLES.Delete_Certs) && (
					<div className="CertButtons mr-2">
						<DefaultButton
							name={DELETE_SELECETED}
							otherClass="DangerButton"
							funct={this.openDeleteAllDialog}
							disabled={!this.props.selectedCerts[0]}
						>
							<RemoveCircleIcon fontSize="small" style={{ marginRight: 6 }} />
						</DefaultButton>
					</div>
				)}
				{validateAccess(Constants.ROLES.Write_Certs) && (
					<div className="CertButtons mr-2">
						<DefaultButton
							name={EMMIT_SELECTED}
							otherClass="EmmitSelectedButton"
							funct={this.props.onMultiEmmit}
							disabled={loading || !this.props.selectedCerts[0]}
						/>
					</div>
				)}
			</>
		);
	};
}

export default withRouter(Certificates);
