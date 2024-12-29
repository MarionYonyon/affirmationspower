import "../../styles/SignupPage.css";
import "../../styles/Buttons.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeUserData } from "../../utils/newUserCreation";
import LoginIconWhite from "../../images/LoginWhite.svg";

const Login = () => {
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Set persistence to local by default
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await initializeUserData(user);
      localStorage.setItem("email", email);

      navigate("/");
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Login error: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
      <h1 className="title">
        Welcome <span className="accent">back</span>
      </h1>
      <p className="subtitle">Take a deep breath and embrace your career journey</p>
        <div className="login-credentials-container">
          <div className="login-credentials-container2">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
          <img src={LoginIconWhite} alt="login-access-icon" />
        </button>
      </div>
    </form>
  );
};

export default Login;