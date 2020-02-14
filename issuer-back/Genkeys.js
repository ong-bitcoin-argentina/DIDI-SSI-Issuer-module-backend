const { Credentials } = require('uport-credentials');

// genera par did / clave privada
const identity = Credentials.createIdentity();
console.log(identity)