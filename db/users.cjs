const client = require("./client.cjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUser = async (username, password) => {
  try {
    //"you give me the plain text password and ill throw it into bcrypt"
    const encryptedPassword = await bcrypt.hash(password, 3);
    console.log(encryptedPassword);

    await client.query(`
        INSERT INTO users (username, password)
        VALUES ('${username}', '${encryptedPassword}');
        `);
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (username, password) => {
  //side note we cant return anything UNLESS we make the await stastement a variable
  try {
    // line 28, we could leave it {rows} as default,
    // but it returns back an array - we can desteructure it where it says rows
    // by adding  : [user] - resulting in use having an object - 'react is going to want an object back"
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username, password FROM users
        WHERE username ='${username}';
        `);
    // This part of the SQL query filters the selection in the users table to find a row where the
    //username column matches the provided username and the password column matches the provided password.
    // It's a condition to retrieve a specific user's information based on the provided username and password exists in the db

    const comparedPassword = await bcrypt.compare(password, user.password);
    // the argument is the plain password and then the crazy password or 'hash'

    // now were going to apply the jwt and give the logged user a token
    //for thier authentication here with an if statment
    // "if i DO find a user ill give you a token and sign it to you"
    // this was all done before implementing the encryption stuff
    if (user && comparedPassword) {
      // 'if user and compared password is true'
      const assignedToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.secret
      ); 
    // assign them a token - .sign gives them the token - then theyre gonna "send one back and see if it matches what what we have" and we cane see if its true or flase
      return assignedToken;
    } else {
      const error = new Error("bad credentials");
      error.status = 401; //this is our error of choice 401 actually means "unauthorized"
      throw error; //throws to catch
    }
  } catch (err) {
    const error = new Error("bad credentials");
    error.status = 401; //this is our error of choice 401 actually means "unauthorized"
    throw error; //throws to server therfore server needs try catch
  }
};

const getUserByToken = async (token) => {
  try {
    const myToken = jwt.verify(token, process.env.secret);
    // we verified the token - which is a long encrpyted string
    // we have turned that string into an object - "my token"
    const {
      rows: [user],
    } = await client.query(`
        SELECT id, username FROM users
        WHERE id=${myToken.id}        
        `);
    return user;
  } catch (err) {}
};

module.exports = {
  createUser,
  getUser,
  getUserByToken,
};
