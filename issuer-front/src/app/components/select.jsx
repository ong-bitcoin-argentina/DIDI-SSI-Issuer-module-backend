import React from "react";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";

export default ({ value, label, onChange, list = [] }) => {
	return (
		<FormControl variant="outlined" style={{ width: "100%" }}>
			<InputLabel id="outlined-label">{label}</InputLabel>
			<Select labelId="outlined-label" value={value} onChange={onChange} label={label}>
				{list.map((item, index) => (
					<MenuItem value={item.value} key={index}>
						{item.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
