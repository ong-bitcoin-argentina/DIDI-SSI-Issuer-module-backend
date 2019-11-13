import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Certificate.css";

import Cookie from "js-cookie";

import Constants from "../../../constants/Constants";
import Messages from "../../../constants/Messages";


class Certificate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
				/* TODO
		const splitPath = this.props.history.location.pathname.split("/");
		const id = splitPath[splitPath.length - 1];
		const token = Cookie.get("token");

		const self = this;
		this.setState({ loading: true });
		ApiService.getCertificate(
			token,
			id,
			async function(cert) {
				self.setState({ id: id, isDialogOpen: false, cert: cert, loading: false });
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
		*/
	}

	onBack = () => {
		this.props.history.push(Constants.ROUTES.CERTIFICATES);
	};

	onLogout = () => {
		Cookie.set("token", "");
		this.props.history.push(Constants.ROUTES.LOGIN);
	};

	render() {
		if (!Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.LOGIN} />;
		}

		return (
			<div className="Certificate">
				{this.renderButtons()}
				<div className="errMsg">{this.state.error && this.state.error.message}</div>
			</div>
		);
	}


	renderButtons = () => {
		return (
			<div className="Certificate-Buttons">
				<button className="backButton" onClick={this.onBack}>
					{Messages.EDIT.BUTTONS.BACK}
				</button>
				<button className="LogoutButton" onClick={this.onLogout}>
					{Messages.EDIT.BUTTONS.EXIT}
				</button>
			</div>
		);
	};
}

export default withRouter(Certificate);
