const Constants = require("./Constants");
const Cookie = require("js-cookie");

const {
	Admin,
	Read_Templates,
	Write_Templates,
	Delete_Templates,
	Read_Certs,
	Write_Certs,
	Delete_Certs,
	Read_Delegates,
	Write_Delegates,
	Read_Dids_Registers,
	Write_Dids_Registers
} = Constants.ROLES;

const ACCESS_ALLOWED = {
	Admin: [Admin],

	// Permisos para Templates
	Read_Templates: [Read_Templates, Write_Templates, Delete_Templates],
	Write_Templates: [Write_Templates],
	Delete_Templates: [Delete_Templates],

	// Permisos para Certificados
	Read_Certs: [Read_Certs, Write_Certs, Delete_Certs],
	Write_Certs: [Write_Certs],
	Delete_Certs: [Delete_Certs],

	// Permisos para Delegaciones
	Read_Delegates: [Read_Delegates, Write_Delegates],
	Write_Delegates: [Write_Delegates],

	// Permisos para Registro de DIDs
	Read_Dids_Registers: [Read_Dids_Registers, Write_Dids_Registers],
	Write_Dids_Registers: [Write_Dids_Registers]
};

export const validateAccess = role => {
	const userRoles = Cookie.get("roles");
	return [Admin, ...ACCESS_ALLOWED[role]].some(r => userRoles.includes(r));
};
