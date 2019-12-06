import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";

import Constants from "../../constants/Constants";
import Login from "../login/Login";
import Lists from "./Lists";
import Template from "../templates/edit/Template";
import Certificate from "../certificates/edit/Certificate";

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
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
