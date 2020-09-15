import React, { Component } from "react";
import { withRouter, Redirect } from "react-router";
import "./Login.scss";

import Cookie from "js-cookie";

import UserService from "../../services/UserService";
import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

import logoApp from "../../images/ai-di-logo.svg";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			password: ""
		};
	}

	onLogin = event => {
		event.preventDefault();

		let self = this;
		UserService.login(
			this.state.name,
			this.state.password,
			async function (token) {
				Cookie.set("token", token);
				self.setState({});
			},
			function (err) {
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
			return <Redirect to={Constants.ROUTES.LIST} />;
			// return <Redirect to={Constants.ROUTES.TEMPLATES} />;
		}

		return (
			<div className="Login">
				<div className="LeftContainer">
					<div className="Content">
						<p className="LoginSubtitle">{Messages.LOGIN.WELCOME}</p>
						<h1 className="LoginTitle">{Messages.LOGIN.WELCOME_2}</h1>
						<form onSubmit={this.onLogin} className="LoginForm">
							<input className="LoginInput" type="text" onChange={this.updateName}></input>
							<input className="LoginInput" type="password" onChange={this.updatePass} autoComplete="on"></input>
							<button className="LoginButton" type="submit" value="Submit">
								{Messages.LOGIN.BUTTONS.ENTER}
							</button>
						</form>
						{this.state.error && <div className="errMsg">{this.state.error.message}</div>}
						{/*this.state.token*/}
					</div>
				</div>
				<div className="RightContainer">
					<img src={logoApp} alt="ai di logo" />
				</div>
			</div>
		);
	}
}

export default withRouter(Login);
