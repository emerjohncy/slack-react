import { Link, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";

const Register = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repPasswordError, setRepPasswordError] = useState("");

  function register(email, password, passwordConfirmation) {
    let data = {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    };

    let requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "follow",
      headers: {
        "Content-Type": "Application/json",
      },
    };

    fetch("/api//api/v1/auth/", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const apiObject = JSON.parse(result);
        console.log(apiObject);
        if (apiObject.status === "error") {
          if ("email" in apiObject.errors) {
            setEmailError(`${emailAddress} ${apiObject.errors.email[0]}`);
          }
          if ("password" in apiObject.errors) {
            setPasswordError(`Password ${apiObject.errors.password[0]}`);
          }
          if ("password_confirmation" in apiObject.errors) {
            setRepPasswordError(
              `Password confirmation ${apiObject.errors.password_confirmation[0]}`
            );
          }
        } else if (apiObject.status === "success") {
        }
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    setEmailError("");
  }, [emailAddress]);

  useEffect(() => {
    setPasswordError("");
  }, [password]);

  useEffect(() => {
    setRepPasswordError("");
  }, [repeatPassword]);

  return (
    <div id="main-con">
      <h1 id="login-title">
        <img
          src={`${process.env.PUBLIC_URL}slacklogo.png`}
          alt="slacklogo"
          id="login-logo"
        />
        Slack Registration
      </h1>
      <form
        className="forms"
        onSubmit={(e) => {
          e.preventDefault();
          register(emailAddress, password, repeatPassword);
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
          <div className="error">{emailError}</div>
        </div>
        <div className="subform">
          <label>Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div className="error">{passwordError}</div>
        </div>
        <div className="subform">
          <label>Repeat Password</label>
          <input
            type="password"
            className="input"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          ></input>
          <div className="error">{repPasswordError}</div>
        </div>
        <input type="submit" id="submit" value="Register"></input>
      </form>
      <p id="login-here">
        Already registered? Head back to Slack <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Register;
