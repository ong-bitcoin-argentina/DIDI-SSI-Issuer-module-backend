import React from "react";

const InputFilter = ({ label, onChange, field }) => {
	const handleChange = e => {
		onChange(e, field);
	};

	return (
		<div>
			<div>{label}</div>
			<input type="text" className="TableInputFilter" onChange={handleChange} />
		</div>
	);
};

export default InputFilter;
