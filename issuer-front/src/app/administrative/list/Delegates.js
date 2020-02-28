import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Delegates.scss";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";
import Cookie from "js-cookie";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import Spinner from "../../utils/Spinner";
import MaterialIcon from "material-icons-react";
import InputDialog from "../../utils/dialogs/InputDialog";
import ConfirmationDialog from "../../utils/dialogs/ConfirmationDialog";

class Delegates extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	// generar referencia para abrir dialogo de borrado desde el padre
	componentDidMount() {
		this.props.onRef(this);
	}

	// borrar referencia
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	// abrir dialogo de borrado
	openDeleteDialog = () => {
		if (this.deleteDialog) this.deleteDialog.open();
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	// mostrar pantalla de delegacion
	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const error = this.props.error || this.state.error;
		const loading = this.props.loading;
		return (
			<div className={loading ? "Admin Loading" : "Admin"}>
				{Spinner.render(loading)}
				{this.renderRenameDialog()}
				{this.renderCreateDialog()}
				{this.renderDeleteDialog()}

				{this.renderSectionButtons(loading)}
				{this.renderTable()}
				{this.renderButtons(loading)}
				<div className="errMsg">{error && error.message}</div>
			</div>
		);
	}

	// muestra el dialogo de cambio de nombre para el issuer
	renderRenameDialog = () => {
		return (
			<InputDialog
				onRef={ref => (this.renameDialog = ref)}
				title={Messages.LIST.DIALOG.ISSUER_RENAME_TITLE(this.props.issuerName)}
				fieldNames={["name"]}
				onAccept={this.props.onRename}
			/>
		);
	};

	// muestra el dialogo de creacion
	renderCreateDialog = () => {
		return (
			<InputDialog
				onRef={ref => (this.createDialog = ref)}
				title={Messages.LIST.DIALOG.CREATE_DELEGATE_TITLE}
				fieldNames={["name", "did"]}
				onAccept={this.props.onCreate}
			/>
		);
	};

	// muestra el dialogo de borrado
	renderDeleteDialog = () => {
		return (
			<ConfirmationDialog
				onRef={ref => (this.deleteDialog = ref)}
				title={Messages.LIST.DIALOG.DELETE_DELEGATE_TITLE}
				message={Messages.LIST.DIALOG.DELETE_CONFIRMATION}
				confirm={Messages.LIST.DIALOG.DELETE}
				onAccept={this.props.onDelete}
			/>
		);
	};

	// mostrar boton de creacion
	renderSectionButtons = loading => {
		const selected = this.props.selected;
		//const name = this.props.issuerName;
		return (
			<div className="HeadButtons">
				{selected && (
					<button
						disabled={loading}
						className="CreateButton"
						onClick={() => {
							if (this.createDialog) this.createDialog.open();
						}}
					>
						<MaterialIcon icon={Constants.DELEGATES.ICONS.ADD_BUTTON} />
						<div className="CreateDelegateButtonText">{Messages.LIST.BUTTONS.CREATE_DELEGATE}</div>
					</button>
				)}
				{/*name && <div className="IssuerName">{name}</div>*/}
			</div>
		);
	};

	// mostrar tabla de delegados
	renderTable = () => {
		const delegates = this.props.delegates;
		const columns = this.props.columns ? this.props.columns : [];

		return (
			<div className="DelegatesTable">
				<ReactTable
					sortable={false}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={delegates}
					columns={columns}
					defaultPageSize={Constants.DELEGATES.TABLE.PAGE_SIZE}
					minRows={Constants.DELEGATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};

	// mostrar botones al pie de la tabla
	renderButtons = loading => {
		return (
			<div className="AdminButtons">
				<button
					className="RenameButton"
					disabled={loading}
					onClick={() => {
						if (this.renameDialog) this.renameDialog.open();
					}}
				>
					{Messages.EDIT.BUTTONS.RENAME_ISSUER}
				</button>
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};
}

export default withRouter(Delegates);
