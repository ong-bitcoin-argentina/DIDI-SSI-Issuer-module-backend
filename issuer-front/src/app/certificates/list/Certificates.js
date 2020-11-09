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

const { Observer } = Constants.ROLES;
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
				{this.renderRevocationDialog()}
				{this.renderSectionButtons(loading)}
				{this.renderTable()}
				{error && <div className="errMsg">{error.message}</div>}
			</div>
		);
	}

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
		const selected = this.props.selected;
		const role = this.props.role;
		return (
			role !== Constants.ROLES.Observer && (
				<div className="HeadButtons">
					{this.renderButtons(loading)}
					{selected && (
						<button disabled={loading} className="CreateButton" onClick={this.onCertificateCreate}>
							<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
							<div className="CreateButtonText EmmitCertText">{Messages.LIST.BUTTONS.CREATE_CERT}</div>
						</button>
					)}
				</div>
			)
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
				/>
			</div>
		);
	};

	// mostrar botones al pie de la tabla
	renderButtons = loading => {
		return (
			<>
				<div className="CertButtons mr-2">
					<button className="DangerButton" onClick={this.props.onDeleteSelects}>
						<RemoveCircleIcon fontSize="small" style={{ marginRight: 6 }} />
						Eliminar Credenciales Seleccionadas
					</button>
				</div>
				<div className="CertButtons mr-2">
					<button disabled={loading} className="CreateButton EmmitSelectedButton" onClick={this.props.onMultiEmmit}>
						<div className="CreateButtonText">{Messages.LIST.BUTTONS.EMMIT_SELECTED}</div>
					</button>
				</div>
			</>
		);
	};
}

export default withRouter(Certificates);
