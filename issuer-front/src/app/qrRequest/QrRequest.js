import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./QrRequest.scss";

import TemplateService from "../../services/TemplateService";
import Cookie from "js-cookie";

import Constants from "../../constants/Constants";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

var QRCode = require("qrcode");

class QrRequest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			qrSet: false
		};
	}

	// cargar templates, certificado, etc
	componentDidMount() {
		// const splitPath = this.props.history.location.pathname.split("/");
		// const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		self.setState({ loading: true });
		// cargar templates
		TemplateService.getAll(
			token,
			function(templates) {
				self.setState({
					templates: templates,
					loading: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	}

	templateSelected = selectedTemplate => {
		const token = Cookie.get("token");

		const self = this;
		self.setState({ loading: true, selectedTemplate: selectedTemplate, qr: undefined });

		// obtener template
		TemplateService.getQrPetition(
			token,
			selectedTemplate._id,
			function(qr) {
				self.setState({
					qr: qr,
					loading: false,
					qrSet: false
				});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	// volver a login
	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		const loading = this.state.loading;
		return (
			<div className="QrReq">
				{!loading && this.renderTemplateSelector()}
				{!loading && this.renderQrPetition()}
			</div>
		);
	}

	renderTemplateSelector = () => {
		const templates = this.state.templates;
		if (!templates) {
			return <div></div>;
		}

		return (
			<div className="TemplateSelector">
				<div className="DataName">{Constants.CERTIFICATES.EDIT.TEMPLATE_SELECT}</div>

				<Autocomplete
					options={templates}
					getOptionLabel={option => (option ? option.name : "")}
					value={this.state.selectedTemplate ? this.state.selectedTemplate : ""}
					renderInput={params => <TextField {...params} variant="standard" label={""} placeholder="" fullWidth />}
					onChange={event => {
						this.templateSelected(this.state.templates[event.target.value]);
					}}
				/>
			</div>
		);
	};

	renderQrPetition() {
		const qr = this.state.qr;
		if (!qr) {
			return <div></div>;
		}

		const self = this;
		if (!self.state.qrSet) {
			setTimeout(function() {
				const canvas = document.getElementById("canvas");
				if (canvas) {
					QRCode.toCanvas(canvas, qr, function(error) {
						if (error) console.error(error);
					});
					self.setState({ qrSet: true });
				}
			}, 100);
		}

		return (
			<div className="QrPetition">
				<canvas id="canvas"></canvas>
			</div>
		);
	}
}

export default withRouter(QrRequest);
