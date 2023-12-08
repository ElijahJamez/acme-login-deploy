import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState({});                                                          // state thath holds our authentication - passed in an empty object cuz that what it returns in the reponse
  const [errorMessage, setErrorMessage] = useState("");
  /// "when we refresh we need to see if they have a token"
  // so we create a useEffect

  useEffect(() => {
    // passing in a function to this use effect
    attemptLoginWithToken();
  }, []);

  const logIn = async (e) => {                                                                    // 'e' means event - makes .event work - they must match tho - bo th must be e or event not mixed
    e.preventDefault();
    try {
      const response = await axios.post("/login", {                                               //equivilent to a fetch - axios (route, +  object with info we wanna send back) this would be considered the 'body' in res.body
        username,
        password,
      });
      // "ok we got the token back lets add that token to local storage"
      localStorage.setItem("token", response.data.token);                                           // grabbing the token within the object
      attemptLoginWithToken();                                                                      // "After token is set i will try to login with it"
      //  above were storing the token locally in the browser
    } catch (err) {
      setErrorMessage(`bad credentials`);
    }
  };

  const attemptLoginWithToken = async () => {
    // line 38 makes it to where when the user refreshes the page that they stay logged in
    // were pointing to that token in the local storage
    // reminder that localStorage and getItem are RESERVED key words - we did not make or name these functions
    const token = localStorage.getItem("token");
    // now we add an if else statment
    if (token) {
      // if token, take us to welcomse user page
      const response = await axios.get("/login", {
        headers: {
          authorization: token,
        },
      });
      // setAuth is filled with an object thanks to the token, that token cntains a username and id
      // if the token is delted, then the state will be empty
      setAuth(response.data);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setAuth({});
  };

  // this reuten statement says " if they are logged in (auth.sername),
  //  show them this welcome page with a logout button - or (represented by ':' ) show them this log in form"
  // if they not logged in this will be an empty object
  return (
    <>
      <h1>Acme Auth</h1>

      {auth.username ? (
        <>
          <h1>welcome {auth.username}</h1>
          <button onClick={logOut}> Log Out</button>
        </>
      ) : (
        <>
          {errorMessage}
          <form onSubmit={logIn}>
            <input
              placeholder="UserName"
              value={username}                                                         // use state 'username'
              onChange={(e) => setUsername(e.target.value)}                            // 'when you vhange this, i want you to do somthing' - eqaul to a function (event) that will set username to whatever they typed - e stands for event - event target value, were targeting the value in that state (what the user entered)
            />
            <br />
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button> Log In</button>
          </form>
        </>
      )}
    </>
  );
};

export default App;
