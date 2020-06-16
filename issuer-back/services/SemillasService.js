const fetch = require("node-fetch");
const options = require('../routes/utils/RequestOptions');

const baseUrl = `https://stage.semillas`;
const urls = {
    create: `${baseUrl}/create`,    //  TODO: put real URL
}


// registra did en semillas
// por ahora es un esqueleto sin funcionalidad
module.exports.create = async function(data) {
    fetch(urls.create, options.post(data))
        .then(res => {

        })
        .then(res => {
            
            return Promise.resolve();
        })
        .catch(err => {
            return Promise.reject();
        })
};