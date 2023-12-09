require("dotenv").config();                                                                 // for some reason we write this import differently - also you want this at the vrey top
const { getUser, getUserByToken } = require("./db/users.cjs");
const express = require("express");
const app = express();

const client = require("./db/client.cjs");                                                   //importing the client
client.connect();                                                                            // connetcting to the client

app.use(express.json());                                                                     // this is a special middleware that lets express read the req.body - use console.log to see when hitting submit
app.use("/assets", express.static(__dirname + "/dist/assets"));
// This line of code is to use a middleware that makes files in the '/dist/assets' folder accessible through the '/assets' URL path
// 'if you make a request for assets go look in this folder'
// dirname is Short for "directory name,"
// - a special word in Node.js that tells you the full location (path) of the folder where your code is running
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

//"if you try to post to login i will go try and find a user in the db"
app.post("/login", async (req, res, next) => {
  //must be placed in a try catch in case user fails to log in
  // 'next' is a third arugment we can add -
  // "express has a built in error handler"
  try {
    const { username, password } = req.body;                                                //"youre gonna send me a name and password and that gonna go in req.body - whci we can get becuase of express.json"
    console.log(username, password);
    const token = await getUser(username, password);                                        //'got get uesr"
    res.send({ token });                                                                    // send back the user to the front end -  9 n"has to be object" - basically sending that token back
    // if user fails authentication this will happen
  } catch (err) {
    next(err);                                                                              // next says 'dont top i want you to go to an error handler'
  }
});

app.get("/login", async (req, res) => {
  const user = await getUserByToken(req.headers.authorization);
  res.send(user);
});

// error for not finding any compatiable routes
// if they tyoe in yoursight./pumpkin and there is no pumpkin route then it would be an error
app.use((req, res) => {
  res.send(`404 route not found`);
});

// our error handler - only goes off when thrown an error
app.use((err, req, res) => {
  console.log(err);
  res.status(401).send({ error: err.message });
}); 

PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
