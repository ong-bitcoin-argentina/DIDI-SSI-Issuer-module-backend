import React from "react";
import "./DataRenderer.scss";

import Constants from "../../constants/Constants";
import Messages from "../../constants/Messages";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import MaterialIcon from "material-icons-react";

import NumericInput from "react-numeric-input";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class DataRenderer {
	// mostrar / editar campos genericos
	static renderData = (dataElem, type, allowEdit, onChange, blockMandatory) => {
		const value = dataElem.value !== undefined ? dataElem.value : dataElem.defaultValue;

		if (dataElem.name === Constants.TEMPLATES.MANDATORY_DATA.NAME) {
			return <div className="DataInput Mandatory">{value}</div>;
		} else {
			if (blockMandatory && Object.values(Constants.TEMPLATES.MANDATORY_DATA).indexOf(dataElem.name) >= 0)
				return <div className="DataInput Mandatory">{value}</div>;
		}

		switch (dataElem.type) {
			case Constants.TEMPLATES.TYPES.BOOLEAN:
				return (
					<Select
						className="DataInput Boolean"
						disabled={!allowEdit}
						autoFocus
						value={value ? value : ""}
						onChange={event => {
							onChange(dataElem, event.target.value, type);
						}}
					>
						<MenuItem className="DataInput" value={"true"}>
							{Constants.TEMPLATES.EDIT.BOOLEAN.TRUE}
						</MenuItem>
						<MenuItem className="DataInput" value={"false"}>
							{Constants.TEMPLATES.EDIT.BOOLEAN.FALSE}
						</MenuItem>
					</Select>
				);
			case Constants.TEMPLATES.TYPES.CHECKBOX:
				return (
					<Select
						className="DataInput Checkbox"
						disabled={!allowEdit}
						autoFocus
						value={value ? value : dataElem.options[0]}
						onChange={event => {
							onChange(dataElem, event.target.value, type);
						}}
					>
						{dataElem.options.map((opt, key) => {
							return (
								<MenuItem value={opt} key={"option-" + key} className="DataInput">
									{opt}
								</MenuItem>
							);
						})}
					</Select>
				);
			case Constants.TEMPLATES.TYPES.DATE:
				return (
					<DatePicker
						disabled={!allowEdit}
						className="DataInput"
						selected={value ? new Date(value) : undefined}
						onChange={date => {
							date = dateFormat(date, "yyyy-mm-dd hh:MM:ss");
							onChange(dataElem, date.replace(" ", "T") + "Z", type);
						}}
						dateFormat="dd-MM-yyyy"
					/>
				);
			case Constants.TEMPLATES.TYPES.NUMBER:
				return (
					<NumericInput
						className="DataInput Number"
						disabled={!allowEdit}
						value={value}
						onChange={value => {
							onChange(dataElem, value, type);
						}}
					/>
				);
			case Constants.TEMPLATES.TYPES.PARAGRAPH:
				return (
					<textarea
						className="DataInput Paragraph"
						disabled={!allowEdit}
						value={value}
						onChange={event => {
							onChange(dataElem, event.target.value, type);
						}}
					/>
				);
			case Constants.TEMPLATES.TYPES.TEXT:
			default:
				const val = value ? value : "";
				return (
					<input
						type="text"
						className="DataInput"
						disabled={!allowEdit}
						value={val}
						onChange={event => {
							onChange(dataElem, event.target.value, type);
						}}
					/>
				);
		}
	};

	// mostrar boton de requerido
	static renderRequired = (dataElem, type, onChange) => {
		return (
			<div
				className="DataRequired"
				onClick={() => {
					onChange(dataElem, type);
				}}
			>
				{(dataElem.required || dataElem.mandatory) && (
					<MaterialIcon icon={Constants.TEMPLATES.EDIT.ICONS.REQUIRED} color="#bdbfbe" />
				)}
				{!dataElem.required && !dataElem.mandatory && (
					<MaterialIcon icon={Constants.TEMPLATES.EDIT.ICONS.NOT_REQUIRED} color="#bdbfbe" />
				)}
				<div>{Messages.EDIT.BUTTONS.REQUIRED}</div>
			</div>
		);
	};

	// mostrar boton de borrado
	static renderDelete = (dataElem, type, onClick) => {
		if (dataElem.mandatory) return <div></div>;

		return (
			<div
				className="DataDelete"
				onClick={() => {
					onClick(dataElem, type);
				}}
			>
				<MaterialIcon icon={Constants.TEMPLATES.EDIT.ICONS.DELETE} color="#eb4646" />
				<div>{Messages.EDIT.BUTTONS.DELETE}</div>
			</div>
		);
	};
}
