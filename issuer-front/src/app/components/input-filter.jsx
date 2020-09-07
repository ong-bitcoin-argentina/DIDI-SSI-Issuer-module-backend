import React from "react";

const InputFilter = ({ label, onChange, field }) => {
	const handleChange = e => {
		onChange(e, field);
	};

	return (
		<div className="InputFilter">
			<div className="HeaderText">{label}</div>
			<div className="InputContainer">
				<input type="text" className="TableInputFilter effect-3" onChange={handleChange} placeholder="Filter by" />
				<span class="focus-border"></span>
			</div>
		</div>
	);
};

export default InputFilter;
