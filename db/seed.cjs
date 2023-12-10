const bcrypt = require("bcrypt");
const client = require("./client.cjs");
const { createUser } = require("./users.cjs");

const dropTables = async () => {
  try {
    await client.query(`
        DROP TABLE IF EXISTS users;
        `);
  } catch (err) {
    console.log(err);
  }
};

const createTables = async () => {
  try {
    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(30) UNIQUE NOT NULL,
            password VARCHAR(60) NOT NULL
        );   
        `);
  } catch (err) {
    console.log(err);
  }
};

const syncAndSeed = async () => {
  try {
    await client.connect();
    console.log("CONNECTED TO THE DB!");

    await dropTables();
    console.log("tables dropped");


    console.log("tables made");

    //fake users that we seeded
    await createUser("eli", "andre666");
    console.log("users created");
  } catch (err) {
    console.log(err);
  }
};

syncAndSeed();
