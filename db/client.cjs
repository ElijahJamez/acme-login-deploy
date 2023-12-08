const { Client } = require("pg");
const client = new Client("postpres://localhost:5432/acme_auth");

module.exports = client;
