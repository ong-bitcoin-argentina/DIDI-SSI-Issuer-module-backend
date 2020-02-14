import React, { Component } from "react";
import "./ConfirmationDialog.scss";

import Messages from "../../../constants/Messages";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

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
			<Dialog open={this.state.isOpen} onClose={this.close} aria-labelledby="form-dialog-title">
				<DialogTitle id="DialogTitle">{title}</DialogTitle>
				<DialogContent>
					<div>{message}</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							if (onAccept) onAccept();
							this.close();
						}}
						color="primary"
					>
						{confirm}
					</Button>
					{!hideClose && (
						<Button onClick={this.close} color="primary">
							{Messages.LIST.DIALOG.CANCEL}
						</Button>
					)}
				</DialogActions>
			</Dialog>
		);
	};
}
