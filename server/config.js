// server/config.js
module.exports = {
    AUTH0_DOMAIN: 'manolo317.eu.auth0.com', // e.g., kmaida.auth0.com
    AUTH0_API_AUDIENCE: 'http://localhost:8083/api/', // e.g., 'http://localhost:8083/api/'
    MONGO_URI: process.env.MONGO_URI || 'mongodb://manolo:moi0786@ds137464.mlab.com:37464/todos'
};
