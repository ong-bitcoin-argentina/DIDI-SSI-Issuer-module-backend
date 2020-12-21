import React, { useState } from "react";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core";
import { REVOCATION_REASONS } from "../../constants/CertificateDefinitions";
import FormSelect from "./FormSelect";
import PropTypes from "prop-types";

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
				<Button onClick={toggleModal} color="primary" disabled={loading}>
					Cancelar
				</Button>
				<Button onClick={handleRevokeConfirm} color="secondary" variant="contained" disabled={!revokeReason}>
					{loading ? <CircularProgress size={20} color="white" /> : "Revocar"}
				</Button>
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
