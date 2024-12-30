// src/pages/MainPage.jsx
import React, { useContext } from "react";
import Auth from "../components/Auth";
import Auctions from "../components/Auctions";
import CreateAuction from "../components/CreateAuction";
import { AuthContext } from "../context/AuthContext";

export default function MainPage() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // Show Auth form if not logged in
    return <Auth />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Your Balance</h2>
        <p>Dollars: {currentUser.dollars}</p>
        <p>Coins: {currentUser.coins}</p>
      </div>

      <Auctions />
      <CreateAuction />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
  },
  box: {
    background: "var(--box-bg)",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  },
};
