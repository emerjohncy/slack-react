import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = ({ setRequiredHeaders }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [Error, setError] = useState("");

  function login(email, password) {
    let data = {
      email: email,
      password: password,
    };

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
      headers: {
        "Content-Type": "Application/json",
      },
    };

    fetch("/api//api/v1/auth/sign_in", requestOptions)
      .then((response) => {
        let headers = {
          accessToken: response.headers.get("access-token"),
          clientToken: response.headers.get("client"),
          expiry: response.headers.get("expiry"),
          uid: response.headers.get("uid"),
        };
        setRequiredHeaders(
          headers
        ); /* object with access-token, client-token, expiry, and uid */
        return response.text();
      })
      .then((result) => {
        let newResult = JSON.parse(result);
        if ("errors" in newResult) {
          setError(`${newResult.errors[0]}`);
        }
        let id = newResult.data.id;

        setRequiredHeaders((prevData) => {
          let newData = prevData;
          newData.currentUserId = id;
          return newData;
        });
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    setError("");
  }, [emailAddress]);

  useEffect(() => {
    setError("");
  }, [password]);

  return (
    <div id="main-con">
      <h1 id="login-title">
        <img
          src={`${process.env.PUBLIC_URL}slacklogo.png`}
          alt="slacklogo"
          id="login-logo"
        />
        Sign in to Slack
      </h1>
      <form
        className="forms"
        onSubmit={(e) => {
          e.preventDefault();
          login(emailAddress, password);
        }}
      >
        <div className="subform">
          <label>Email address</label>
          <input
            type="text"
            className="input"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          ></input>
          <div className="error"></div>
        </div>
        <div className="subform">
          <label>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div className="error">{Error}</div>
        </div>
        <input type="submit" id="submit" value="Sign In"></input>
      </form>
      <p id="register-here">
        Not yet registered? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
