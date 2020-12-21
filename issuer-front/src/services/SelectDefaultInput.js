import { CircularProgress, FormControl, Grid, MenuItem, Select } from "@material-ui/core";
import React from "react";

const SelectDefaultInput = ({ onChange, loading, label, options, parseData, name, value }) => (
	<Grid item xs={12} container style={{ marginBottom: "25px" }}>
		<Grid item xs={4} container alignItems="center">
			<span>{label}</span>
		</Grid>
		<Grid item xs={6}>
			<FormControl variant="outlined" fullWidth>
				<Select name={name} disabled={loading} onChange={onChange} defaultValue={value[name]}>
					{options.map(({ _id, ...rest }) => (
						<MenuItem value={_id} key={_id}>
							{parseData(rest)}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Grid>
		<Grid item xs={2} container justify="center" alignItems="center">
			{loading && <CircularProgress />}
		</Grid>
	</Grid>
);

export default SelectDefaultInput;
