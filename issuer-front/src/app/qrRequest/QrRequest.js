import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./QrRequest.scss";

import TemplateService from "../../services/TemplateService";
import Cookie from "js-cookie";

import Constants from "../../constants/Constants";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

class QrRequest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
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
		self.setState({ loading: true });

		// obtener template
		TemplateService.get(
			token,
			selectedTemplate._id,
			function(template) {
				self.setState({
					selectedTemplate: selectedTemplate,
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
				{ !loading && this.renderTemplateSelector() }
				{ !loading && this.renderQrPetition(selectedTemplate) }
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
		const selectedTemplate = this.state.selectedTemplate;

		return (
			<div className="QrPetition">

			</div>
		);
	}

};

export default withRouter(QrRequest);
