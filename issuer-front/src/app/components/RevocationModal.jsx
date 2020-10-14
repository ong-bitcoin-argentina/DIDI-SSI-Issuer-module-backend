import React, { useState } from "react";
import moment from "moment";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core";
import Cookie from "js-cookie";
import CertificateService from "../../services/CertificateService";
import KeyValue from "./KeyValue";
import { DATE_FORMAT } from "../../constants/Constants";
import { REVOCATION_REASONS } from "../../constants/CertificateDefinitions";
import FormSelect from "./FormSelect";

const RevocationModal = ({ cert, open, onClose, onSuccess, onFail, toggleModal }) => {
	const [revokeReason, setRevokeReason] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRevokeConfirm = () => {
		const token = Cookie.get("token");
		setLoading(true);
		const result = CertificateService.revoke(token, cert._id, revokeReason, handleSuccess, onFail);
	};

	const handleSuccess = () => {
		setLoading(false);
		setRevokeReason("");
		onSuccess();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle id="form-dialog-title">
				<div>Estás por revocar la siguiente credencial:</div>
				<div style={{ marginTop: 10 }}>
					{cert && (
						<>
							<KeyValue field={"DID"} value={cert.did} />
							<KeyValue field={"Nombre y Apellido"} value={`${cert.firstName} ${cert.lastName}`} />
							<KeyValue field={"Certificado"} value={cert.name} />
							<KeyValue field={"Fecha de creación"} value={moment(cert.createdOn).format(DATE_FORMAT)} />
							<KeyValue field={"Fecha de emisión"} value={moment(cert.emmitedOn).format(DATE_FORMAT)} />
						</>
					)}
				</div>
			</DialogTitle>
			<DialogContent style={{ margin: "0px 0 25px" }}>
				<FormSelect
					label="Razón de revocación"
					value={revokeReason}
					list={REVOCATION_REASONS}
					onChange={e => setRevokeReason(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={toggleModal} color="primary">
					Cancelar
				</Button>
				<Button onClick={handleRevokeConfirm} color="secondary" variant="contained" disabled={!revokeReason}>
					{loading ? <CircularProgress size={20} color="white" /> : "Revocar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RevocationModal;
