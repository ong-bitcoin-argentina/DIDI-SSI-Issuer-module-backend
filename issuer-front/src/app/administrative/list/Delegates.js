import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Delegates.scss";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";
import Cookie from "js-cookie";

import ReactTable from "react-table";
import "react-table/react-table.css";

import MaterialIcon from "material-icons-react";
import InputDialog from "../../utils/dialogs/InputDialog";
import ConfirmationDialog from "../../utils/dialogs/ConfirmationDialog";

class Delegates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		};
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

		const error = this.state.error;
		const loading = this.state.loading;
		return (
			<div className="Admin">
				{this.renderCreateDialog()}
				{this.renderDeleteDialog()}

				{this.renderSectionButtons()}
				{!loading && this.renderTable()}
				{this.renderButtons()}
				<div className="errMsg">{error && error.message}</div>
			</div>
		);
	}

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
	renderSectionButtons = () => {
		const selected = this.props.selected;
		return (
			<div className="HeadButtons">
				{selected && (
					<button
						className="CreateButton"
						onClick={() => {
							if (this.createDialog) this.createDialog.open();
						}}
					>
						<MaterialIcon icon={Constants.DELEGATES.ICONS.ADD_BUTTON} />
						<div className="CreateDelegateButtonText">{Messages.LIST.BUTTONS.CREATE_DELEGATE}</div>
					</button>
				)}
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
	renderButtons = () => {
		return (
			<div className="AdminButtons">
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};
}

export default withRouter(Delegates);
