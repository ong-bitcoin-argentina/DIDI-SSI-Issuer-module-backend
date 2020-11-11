import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@material-ui/core";
import React from "react";
import KeyValue from "../components/KeyValue";
import { DATE_FORMAT } from "../../constants/Constants";
import moment from "moment";

const formatDate = date => (date ? moment(date).format(DATE_FORMAT) : "-");

const ModalDetail = ({ modalOpen, setModalOpen, register }) => {
	const { did, name, createdOn, expiredOn } = register;
	const blockchain = did?.split(":")[2];
	const didKey = did?.split(":")[3];
	const createdOn_ = formatDate(createdOn);
	const expiredOn_ = formatDate(expiredOn);

	return (
		<Dialog open={modalOpen}>
			<DialogTitle id="form-dialog-title">
				<div>Detalles del Registro</div>
			</DialogTitle>
			<DialogContent style={{ margin: "0px 0 25px" }}>
				<Grid container item xs={12} justify="center" direction="column">
					<KeyValue field="DID" value={didKey} />
					<KeyValue field="Blockchain" value={blockchain} />
					<KeyValue field="Nombre" value={name} />
					<KeyValue field="Fecha de Registro" value={createdOn_} />
					<KeyValue field="Fecha de Expiración" value={expiredOn_} />
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button color="primary" variant="contained" onClick={() => setModalOpen(false)}>
					cerrar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ModalDetail;
