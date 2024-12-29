import React, { useState } from "react";
import GoogleIcon from "../images/GoogleIcon.svg";
import MicrosoftIcon from "../images/MicrosoftIcon.svg";

const SignUpPage = () => {
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Create an <span style={styles.accent}>Account</span>
      </h1>
      <p style={styles.subtitle}>
        You are few moments away from getting started!
      </p>

      <div style={styles.socialSignUpContainer}>
        <button className="login-access-button" style={styles.socialButton}>
          <img src={GoogleIcon} alt="google-icon" />
          Sign Up with Google
        </button>
        <button className="login-access-button" style={styles.socialButton}>
        <img src={MicrosoftIcon} alt="microsoft-icon" />
          Sign Up with Microsoft
        </button>
      </div>

      <div style={styles.dividerContainer}>
        <hr style={styles.divider} />
        <span style={styles.orText}>or continue with Email</span>
        <hr style={styles.divider} />
      </div>

      <div style={styles.inputContainer}>
        <input type="email" placeholder="Email" style={styles.input} />
        <div style={styles.passwordWrapper}>
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onFocus={() => setShowPasswordPopup(true)}
            onBlur={() => setShowPasswordPopup(false)}
          />
          {showPasswordPopup && (
            <div style={styles.passwordPopup}>
              <p>Password must:</p>
              <ul style={styles.passwordRequirements}>
                <li>Be at least 8 characters</li>
                <li>Have at least one special character</li>
                <li>Have at least one number</li>
                <li>Have at least one alphabet</li>
                <li>No whitespaces</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <button style={styles.signUpButton}>SIGN UP</button>
      <button style={styles.logInButton}>LOG IN</button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  accent: {
    color: "#673ab7",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
  },
  checkboxContainer: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    marginLeft: "8px",
  },
  socialSignUpContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "#f7f7f7",
    border: "1px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
  },
  icon: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  divider: {
    flex: 1,
    height: "1px",
    backgroundColor: "#ddd",
    border: "none",
  },
  orText: {
    margin: "0 10px",
    color: "#aaa",
    fontSize: "12px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordPopup: {
    position: "absolute",
    top: "0",
    right: "100%",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
    width: "250px",
    textAlign: "left",
  },
  passwordRequirements: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    fontSize: "12px",
  },
  signUpButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  termsText: {
    fontSize: "12px",
    color: "#aaa",
  },
  link: {
    color: "#ff00ff",
    textDecoration: "none",
  },
  logInButton: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default SignUpPage;
