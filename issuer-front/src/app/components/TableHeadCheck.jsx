import React, { useState, useEffect } from "react";
import Messages from "../../constants/Messages";
import { Checkbox } from "@material-ui/core";
const { SELECT } = Messages.LIST.TABLE;

const TableHeadCheck = ({ all, selected, onChange }) => {
	const [checked, setChecked] = useState(all);

	useEffect(() => {
		onChange(checked);
	}, [checked]);

	useEffect(() => {
		setChecked(all);
	}, [all]);

	return (
		<div className="SelectorHeader">
			<div className="HeaderText">
				<p>{SELECT}</p>
				<p>{Object.values(selected).filter(val => val).length}</p>
			</div>
			<div className="Actions">
				<Checkbox checked={checked} onChange={(e, val) => setChecked(val)} />
			</div>
		</div>
	);
};

export default TableHeadCheck;
