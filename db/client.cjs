const { Client } = require("pg");
const connection = process.env.DATABASE_URL || 'postpres://localhost:5432/acme_auth';
const client = new Client(connection);

module.exports = client;
