import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Login from "../login/Login";
import Templates from "../templates/list/Templates";
import Template from "../templates/edit/Template";
import Constants from "../../constants/Constants";

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
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
