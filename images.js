const fetch = require('fetch');

//image url to byte array
const URLtoBuffer = (url, callback) => fetch.fetchUrl(url, (error, meta, body) =>{
        callback(body);
});

module.exports = URLtoBuffer