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
import { validateAccess } from "../../../constants/Roles";
import RegisterService from "../../../services/RegisterService";

class Delegates extends Component {
	constructor(props) {
		super(props);

		this.state = {
			registers: []
		};
	}

	// generar referencia para abrir dialogo de borrado desde el padre
	componentDidMount() {
		this.props.onRef(this);
		this.getRegisters();
	}

	async getRegisters() {
		const token = Cookie.get("token");
		const registers = await RegisterService.getAll()(token);
		this.setState({ registers });
	}

	// borrar referencia
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	// abrir dialogo de borrado
	openDeleteDialog = () => {
		if (this.deleteDialog) this.deleteDialog.open();
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
				{this.renderCreateDialog()}
				{this.renderDeleteDialog()}

				{this.renderSectionButtons(loading)}
				{error && <div className="errMsg">{error.message}</div>}
				{this.renderTable()}
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
				selectNames={[
					{
						name: "registerId",
						label: "Emisor",
						options: this.state.registers
					}
				]}
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
				message={Messages.LIST.DIALOG.DELETE_CONFIRMATION("el Delegado")}
				confirm={Messages.LIST.DIALOG.DELETE}
				onAccept={this.props.onDelete}
			/>
		);
	};

	// mostrar boton de creacion
	renderSectionButtons = loading => {
		return (
			<div className="HeadButtons">
				{validateAccess(Constants.ROLES.Write_Delegates) && (
					<button
						disabled={loading}
						className="CreateButton"
						onClick={() => {
							if (this.createDialog) this.createDialog.open();
						}}
					>
						<MaterialIcon icon={Constants.DELEGATES.ICONS.ADD_BUTTON} />
						<div className="CreateButtonText CreateDelegateText">{Messages.LIST.BUTTONS.CREATE_DELEGATE}</div>
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
}

export default withRouter(Delegates);
