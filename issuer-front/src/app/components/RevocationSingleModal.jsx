import React from "react";
import KeyValue from "./KeyValue";
import RevocationModal from "./RevocationModal";
import moment from "moment";
import { DATE_FORMAT } from "../../constants/Constants";
import PropTypes from "prop-types";

const RevocationSingleModal = props => {
	const { activeCert } = props;
	return (
		<RevocationModal {...props}>
			{activeCert && (
				<>
					<KeyValue field={"DID"} value={activeCert.did} />
					<KeyValue field={"Nombre y Apellido"} value={`${activeCert.firstName} ${activeCert.lastName}`} />
					<KeyValue field={"Certificado"} value={activeCert.name} />
					<KeyValue field={"Fecha de creación"} value={moment(activeCert.createdOn).format(DATE_FORMAT)} />
					<KeyValue field={"Fecha de emisión"} value={moment(activeCert.emmitedOn).format(DATE_FORMAT)} />
				</>
			)}
		</RevocationModal>
	);
};

RevocationSingleModal.propTypes = {
	props: PropTypes.object.isRequired
};

export default RevocationSingleModal;
