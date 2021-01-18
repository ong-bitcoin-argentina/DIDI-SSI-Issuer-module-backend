import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import React from "react";
import KeyValue from "../components/KeyValue";
import Constants, { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";
import ModalTitle from "../utils/modal-title";
import DefaultButton from "./default-button";

const TITLE = "Detalles del Registro";

const formatDate = date => (date ? moment(date).format(DATE_FORMAT) : "-");

const { CREATING, ERROR, REVOKING, REVOKED } = Constants.STATUS;

const ModalDetail = ({ modalOpen, setModalOpen, register, handleRefresh, handleRevoke }) => {
	const { did, name, createdOn, expireOn, blockHash, messageError, status, blockchain } = register;
	const partsOfDid = did?.split(":");
	const didKey = partsOfDid && partsOfDid[partsOfDid.length - 1];
	const createdOn_ = formatDate(createdOn);
	const expireOn_ = formatDate(expireOn);
	const statusNotAllowed = [CREATING, ERROR, REVOKING, REVOKED];

	return (
		<Dialog open={modalOpen}>
			<DialogTitle id="form-dialog-title">
				<ModalTitle title={TITLE} />
			</DialogTitle>
			<DialogContent style={{ margin: "0px 0 25px" }}>
				<Grid container item xs={12} justify="center" direction="column" style={{ marginBottom: "5px" }}>
					<KeyValue field="DID" value={didKey} />
					<KeyValue field="Blockchain" value={blockchain} />
					<KeyValue field="Nombre" value={name} />
					<KeyValue field="Fecha de Registro" value={createdOn_} />
					{expireOn_ && expireOn_ !== "-" && <KeyValue field="Fecha de Expiración" value={expireOn_} />}
					{messageError && <KeyValue field="Mensaje de Error" value={messageError} />}
					{blockHash && <KeyValue field="Hash de Transacción" value={blockHash} />}
				</Grid>
				<DefaultButton
					funct={() => handleRevoke(did)}
					otherClass="DangerButton"
					name="Revocar"
					disabled={statusNotAllowed.includes(status)}
				/>
			</DialogContent>
			<DialogActions style={{ padding: "2em 25px" }}>
				<Grid container justify="space-between">
					<DefaultButton
						funct={() => handleRefresh(did)}
						otherClass="WarningButton"
						name="Renovar"
						disabled={statusNotAllowed.includes(status)}
					/>
					<DefaultButton funct={() => setModalOpen(false)} name="Cerrar" />
				</Grid>
			</DialogActions>
		</Dialog>
	);
};

export default ModalDetail;
