import React, { Component } from "react";
import { withRouter } from "react-router";
import "./Templates.scss";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";

import Spinner from "../../utils/Spinner";
import InputDialog from "../../utils/dialogs/InputDialog";
import ConfirmationDialog from "../../utils/dialogs/ConfirmationDialog";
import MaterialIcon from "material-icons-react";

class Templates extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	// generar referencia para abrirlo desde el padre
	componentDidMount() {
		this.props.onRef(this);
	}

	// borrar referencia
	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	// abrir dialogo de borrado de modelos
	openDeleteDialog = () => {
		if (this.deleteDialog) this.deleteDialog.open();
	};

	// mostrar pantalla de modelos de certificados
	render() {
		const error = this.props.error || this.state.error;
		const loading = this.props.loading;
		return (
			<div className={loading ? "Templates Loading" : "Templates"}>
				{Spinner.render(loading)}
				{this.renderSectionButtons(loading)}
				{this.renderDeleteDialog()}
				{this.renderCreateDialog()}
				{this.renderTable()}
				<div className="errMsg">{error && error.message}</div>
			</div>
		);
	}

	// muestra el dialogo de creacion
	renderCreateDialog = () => {
		return (
			<InputDialog
				onRef={ref => (this.createDialog = ref)}
				title={Messages.LIST.DIALOG.CREATE_TEMPLATE_TITLE}
				fieldNames={["name"]}
				onAccept={this.props.onCreate}
			/>
		);
	};

	// muestra el dialogo de borrado
	renderDeleteDialog = () => {
		return (
			<ConfirmationDialog
				onRef={ref => (this.deleteDialog = ref)}
				title={Messages.LIST.DIALOG.DELETE_TEMPLATE_TITLE}
				message={Messages.LIST.DIALOG.DELETE_CONFIRMATION}
				confirm={Messages.LIST.DIALOG.DELETE}
				onAccept={this.props.onDelete}
			/>
		);
	};

	// muestra boton de creacion de modelos de certificados
	renderSectionButtons = loading => {
		const selected = this.props.selected;
		return (
			<div className="HeadButtons">
				{selected && (
					<button
						className="CreateButton TemplateCreateButton"
						disabled={loading}
						onClick={() => {
							if (this.createDialog) this.createDialog.open();
						}}
					>
						<MaterialIcon icon={Constants.TEMPLATES.ICONS.ADD_BUTTON} />
						<div className="CreateButtonText TemplateCreateText">{Messages.LIST.BUTTONS.CREATE_TEMPLATE}</div>
					</button>
				)}
			</div>
		);
	};

	// muestra tabla de modelos de certificados
	renderTable = () => {
		const templates = this.props.templates;
		const columns = this.props.columns ? this.props.columns : [];

		return (
			<div className="TemplateTable">
				<ReactTable
					sortable={false}
					previousText={Messages.LIST.TABLE.PREV}
					nextText={Messages.LIST.TABLE.NEXT}
					data={templates}
					columns={columns}
					defaultPageSize={Constants.TEMPLATES.TABLE.PAGE_SIZE}
					minRows={Constants.TEMPLATES.TABLE.MIN_ROWS}
				/>
			</div>
		);
	};
}

export default withRouter(Templates);
