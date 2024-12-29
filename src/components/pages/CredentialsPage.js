import "../../styles/LoginPage.css";
import "../../styles/Buttons.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initializeUserData } from "../../utils/newUserCreation";
import LoginIconWhite from "../../images/LoginWhite.svg";

const Login = () => {
  const [email, setEmail] = useState("example@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await initializeUserData(user);
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
        <h2>Welcome back</h2>
        <div className="login-credentials-container">
          <div className="login-credentials-container2">
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
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
