import { Typography } from "@material-ui/core";
import React from "react";
import RevocationModal from "./RevocationModal";
import PropTypes from "prop-types";

const RevocationAllModal = props => {
	const { certs } = props;

	return (
		<RevocationModal {...props} onSuccess={() => {}} title="Estás por revocar la siguientes credenciales:">
			{certs.map(cert => (
				<Typography key={cert._id} className={cert.revoked ? "green" : ""}>
					- {cert.certName} - {`${cert.firstName} ${cert.lastName}`}
				</Typography>
			))}
		</RevocationModal>
	);
};

RevocationAllModal.propTypes = {
	props: PropTypes.object.isRequired
};

export default RevocationAllModal;
