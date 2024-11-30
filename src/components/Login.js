import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { logSessionStart } from '../utils/firebaseHelpers';
import { initializeUserData } from '../utils/newUserCreation'; // Import the initialization function

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Attempt to sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Call initialization for new user data setup
      const user = userCredential.user;
      await initializeUserData(user); // Ensure user has default parameters in Firestore

      // Redirect to main app page on success
      logSessionStart(); // Start session tracking
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error("Login error: ", err.message); // Log error for debugging
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;