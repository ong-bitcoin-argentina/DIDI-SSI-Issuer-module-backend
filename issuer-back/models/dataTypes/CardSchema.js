const { Schema } = require("mongoose");

function rowLimit(val) {
    return (!val || ((val.length > 0) && (val.length <= 5)));
}

const cardSchema = new Schema({
    rows: {
        type: Array,
        columns: {
            type: Number,
            default: 1,
            min: 1,
            max: 2
        },
        validate: { 
            validator: rowLimit,
            message: "Cantidad de filas maximas superadas"
        }
    },
});

module.exports = {
    cardSchema
}