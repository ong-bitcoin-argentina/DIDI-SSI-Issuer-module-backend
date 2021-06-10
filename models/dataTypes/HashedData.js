// tipo de data hasheado (password):
// se guarda el hash y el salt (no se guarda la data ya que solo se lo necesita para comparaciones)

module.exports = {
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
};
