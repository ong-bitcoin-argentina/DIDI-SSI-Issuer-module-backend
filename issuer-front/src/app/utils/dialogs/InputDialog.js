import React, { Component } from "react";

import Messages from "../../../constants/Messages";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./_Style.scss";
import "../../../styles/GeneralStyles.scss";
import { Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import BlockchainName from "./blockchainName";
import DefaultButton from "../../setting/default-button";

export default class InputDialog extends Component {
	constructor(props) {
		super(props);

		const fields = {};
		this.props.fieldNames.forEach(fieldName => (fields[fieldName] = ""));

		this.state = {
			isOpen: false,
			fields: { ...fields },
			error: ""
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

	// limpiar campos completados por el usuario
	cleanData = () => {
		const fields = this.state.fields;
		for (let key of Object.keys(this.state.fields)) {
			fields[key] = "";
		}

		this.setState({
			fields: fields
		});
	};

	// abrir dialogo
	open = () => {
		this.cleanData();
		this.setState({
			isOpen: true
		});
	};

	// cerrar dialogo
	close = () => {
		this.cleanData();
		this.setState({
			isOpen: false,
			error: ""
		});
	};

	// actualiza campo
	updateField = (name, value) => {
		const fields = this.state.fields;
		fields[name] = value;
		this.setState({ fields: fields });
	};

	handleAccept = async () => {
		try {
			await this.props.onAccept(this.state.fields);
			this.close();
		} catch (error) {
			this.setState({ error: error.message });
		}
	};

	// retorna dialogo
	render = () => {
		const title = this.props.title;
		const fieldNames = this.props.fieldNames;
		const selectNames = this.props.selectNames || [];
		const registerIdDefault = this.props.registerIdDefault;

		return (
			<Dialog
				className="dialogBox"
				open={this.state.isOpen}
				onClose={() => {
					if (!this.props.loading) this.close();
				}}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="DialogTitle">{title}</DialogTitle>
				<DialogContent>
					{fieldNames.length > 0 &&
						fieldNames.map((name, key) => {
							return (
								<TextField
									key={"field-" + key}
									autoFocus
									margin="dense"
									id={name}
									label={name}
									type="text"
									onChange={event => {
										this.updateField(name, event.target.value);
									}}
									fullWidth
								/>
							);
						})}
					{selectNames.length !== 0 &&
						selectNames.map(({ name, label, options }, key) => {
							return (
								<Grid style={{ marginTop: "25px" }}>
									<InputLabel id={`${label}-select-label`}>{label}</InputLabel>
									<Select
										labelId={`${label}-select-label`}
										key={"select-" + key}
										id={name}
										name={name}
										defaultValue={registerIdDefault || undefined}
										label={label}
										onChange={event => {
											this.updateField(name, event.target.value);
										}}
										fullWidth
									>
										{options.length !== 0 &&
											options.map(({ name, did, _id }) => (
												<MenuItem key={_id} value={_id}>
													{name}
													<BlockchainName did={did} />
												</MenuItem>
											))}
									</Select>
								</Grid>
							);
						})}
					{this.state.error && <div className="errMsg">{this.state.error}</div>}
				</DialogContent>
				<DialogActions>
					<DefaultButton
						otherClass="DangerButtonOutlined"
						name={Messages.LIST.DIALOG.CANCEL}
						funct={this.close}
						disabled={this.props.loading}
					/>
					<DefaultButton
						name={Messages.LIST.DIALOG.CREATE}
						disabled={Object.values(this.state.fields).indexOf("") >= 0 || this.props.loading}
						funct={this.handleAccept}
						loading={this.props.loading}
					/>
				</DialogActions>
			</Dialog>
		);
	};
}
