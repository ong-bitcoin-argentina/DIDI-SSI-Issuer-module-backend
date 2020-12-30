import React, { Component } from "react";

import Messages from "../../../constants/Messages";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import "./_Style.scss";
import "../../../styles/GeneralStyles.scss";
import DefaultButton from "../../setting/default-button";

export default class ConfirmationDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
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

	// abrir dialogo
	open = () => {
		this.setState({
			isOpen: true
		});
	};

	// cerrar dialogo
	close = () => {
		this.setState({
			isOpen: false
		});
	};

	// retorna dialogo
	render = () => {
		const title = this.props.title;
		const message = this.props.message;
		const confirm = this.props.confirm;
		const onAccept = this.props.onAccept;
		const hideClose = this.props.hideClose;

		return (
			<Dialog className="dialogBox" open={this.state.isOpen} onClose={this.close} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{title}</DialogTitle>
				<DialogContent>
					<div className="DeleteMessage">
						<span class="material-icons" style={{ marginBottom: "25px" }}>
							delete_outline
						</span>
						{message}
					</div>
				</DialogContent>
				<DialogActions>
					{!hideClose && (
						<DefaultButton funct={this.close} otherClass="DangerButtonOutlined" name={Messages.LIST.DIALOG.CANCEL} />
					)}
					<DefaultButton
						funct={() => {
							if (onAccept) onAccept();
							this.close();
						}}
						name={confirm}
					/>
				</DialogActions>
			</Dialog>
		);
	};
}
