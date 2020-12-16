import React from "react";
import { Tooltip } from "@material-ui/core";

const Action = ({ handle, title, Icon, color }) => (
	<div className="EditAction" onClick={handle}>
		<Tooltip title={title} placement="top" arrow>
			<Icon fontSize="medium" style={{ color: color }} />
		</Tooltip>
	</div>
);

export default Action;
