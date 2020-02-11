import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";

import Constants from "../../constants/Constants";
import Login from "../login/Login";
import Lists from "./Lists";
import Template from "../templates/edit/Template";
import Certificate from "../certificates/edit/Certificate";
import Participants from "../participants/Participants";
import Delegates from "../administrative/list/Delegates";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route exact path="/" component={Login} />
						<Route exact path={Constants.ROUTES.LOGIN} component={Login} />
						<Route exact path={Constants.ROUTES.LIST} component={Lists} />
						<Route exact path={Constants.ROUTES.TEMPLATES} component={Lists} />
						<Route exact path={Constants.ROUTES.CERTIFICATES} component={Lists} />
						<Route path={Constants.ROUTES.EDIT_TEMPLATE} component={Template} />
						<Route path={Constants.ROUTES.EDIT_CERT} component={Certificate} />
						<Route path={Constants.ROUTES.QR_REQUEST} component={Participants} />
						<Route path={Constants.ROUTES.DELEGATES} component={Delegates} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
