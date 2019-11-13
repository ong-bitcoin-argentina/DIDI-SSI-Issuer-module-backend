import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Constants from "../../constants/Constants";
import Login from "../login/Login";
import Templates from "../templates/list/Templates";
import Template from "../templates/edit/Template";
import Certificates from "../certificates/list/Certificates";
import Certificate from "../certificates/edit/Certificate";

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route exact path="/" component={Login} />
						<Route exact path={Constants.ROUTES.LOGIN} component={Login} />
						<Route exact path={Constants.ROUTES.TEMPLATES} component={Templates} />
						<Route path={Constants.ROUTES.EDIT_TEMPLATE} component={Template} />
						<Route exact path={Constants.ROUTES.CERTIFICATES} component={Certificates} />
						<Route path={Constants.ROUTES.EDIT_CERT} component={Certificate} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
