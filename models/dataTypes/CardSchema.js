function rowLimit(val) {
  return !val || (val.length > 0 && val.length <= 5);
}

// Do it with mongoose.Schema when its become necessary separate CardLayout from Template
const cardSchema = {
  rows: {
    type: Array,
    columns: {
      type: Number,
      default: 1,
      min: 1,
      max: 2,
    },
    validate: {
      validator: rowLimit,
      message: 'Cantidad de filas maximas superadas',
    },
  },
  backgroundImage: { type: String },
  style: { type: String },
};

module.exports = {
  cardSchema,
};
