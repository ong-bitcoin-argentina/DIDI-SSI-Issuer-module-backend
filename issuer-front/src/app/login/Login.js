import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Login.scss";

import Cookie from "js-cookie";

import UserService from "../../services/UserService";
import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			password: ""
		};
	}

	onLogin = () => {
		let self = this;
		UserService.login(
			this.state.name,
			this.state.password,
			async function(token) {
				Cookie.set("token", token);
				self.setState({});
			},
			function(err) {
				self.setState({ error: err });
				console.log(err);
			}
		);
	};

	updateName = event => {
		this.setState({ name: event.target.value, error: "" });
	};

	updatePass = event => {
		this.setState({ password: event.target.value, error: "" });
	};

	render() {
		if (Cookie.get("token")) {
			return <Redirect to={Constants.ROUTES.TEMPLATES} />;
		}

		return (
			<div className="Login">
				<h1 className="BackgroundText">{Messages.LOGIN.WELCOME}</h1>
				<input className="LoginInput" type="text" onChange={this.updateName}></input>
				<input className="LoginInput" type="password" onChange={this.updatePass}></input>
				<button className="LoginButton" onClick={this.onLogin}>
					{Messages.LOGIN.BUTTONS.ENTER}
				</button>

				<div className="errMsg">{this.state.error && this.state.error.message}</div>
				{/*this.state.token*/}
			</div>
		);
	}
}

export default withRouter(Login);
