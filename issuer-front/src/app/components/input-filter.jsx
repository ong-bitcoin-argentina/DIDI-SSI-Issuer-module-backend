import React from "react";

const InputFilter = ({ label, onChange, field }) => {
	const handleChange = e => {
		onChange(e, field);
	};

	return (
		<div className="InputFilter">
			<div className="HeaderText">{label}</div>
			<div className="InputContainer">
				<input type="text" className="TableInputFilter effect-3" onChange={handleChange} placeholder="Filtrar" />
				<span className="focus-border"></span>
			</div>
		</div>
	);
};

export default InputFilter;
