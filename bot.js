const {TwitterApi} = require('twitter-api-v2');
const client = new TwitterApi({    
    appKey: 'mkkuQz4oMAWn79Ky8Qrogard8',  
    appSecret: 'Xegr6BCoCpPIiM4BXbaNfb8LUqXFWjWQaDzCtbTliE9BqauZaZ',
    accessToken: '1576099475281661954-F6OPHMAALz66hHVT3AGNIT1rrh8tKG',  
    accessSecret: 'IHh2oeTKqQV8nGKC16VLmnP3WOUuek9QAjpZ47P2Nth1W'
});

const rwClient = client.readWrite;

module.exports = rwClient;