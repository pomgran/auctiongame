// src/components/Auth.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Auth() {
  const { signup, login, currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, username);
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  if (currentUser) {
    return null; // Already logged in, hide the Auth form
  }

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isLogin && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} style={styles.linkButton}>
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}

const styles = {
  container: {
    margin: "20px auto",
    width: "300px",
    textAlign: "center",
    padding: "20px",
    borderRadius: "8px",
    background: "var(--box-bg)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "var(--accent-color)",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "var(--accent-color)",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
