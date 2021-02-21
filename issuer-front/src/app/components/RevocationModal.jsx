import React, { useState } from "react";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { REVOCATION_REASONS } from "../../constants/CertificateDefinitions";
import FormSelect from "./FormSelect";
import PropTypes from "prop-types";
import DefaultButton from "../setting/default-button";

const RevocationModal = ({ open, onClose, onSuccess, toggleModal, handleSubmit, title, children }) => {
	const [revokeReason, setRevokeReason] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRevokeConfirm = async () => {
		setLoading(true);
		handleSubmit(revokeReason, handleSuccess, handleFail);
	};

	const handleSuccess = data => {
		setLoading(false);
		setRevokeReason("");
		onSuccess();
	};

	const handleFail = () => {
		setLoading(false);
		setRevokeReason("");
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle id="form-dialog-title">
				<div>{title}</div>
			</DialogTitle>
			<DialogContent style={{ margin: "0px 0 25px" }}>
				<div style={{ marginBottom: 25 }}>{children}</div>
				<FormSelect
					label="Razón de revocación"
					value={revokeReason}
					list={REVOCATION_REASONS}
					onChange={e => setRevokeReason(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<DefaultButton funct={toggleModal} otherClass="CreateButtonOutlined" name="Cancelar" />
				<DefaultButton
					funct={handleRevokeConfirm}
					otherClass="DangerButton"
					disabled={!revokeReason}
					loading={loading}
					name="Revocar"
				/>
			</DialogActions>
		</Dialog>
	);
};

RevocationModal.propTypes = {
	open: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	toggleModal: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	children: PropTypes.node
};

export default RevocationModal;
