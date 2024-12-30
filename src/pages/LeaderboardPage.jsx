// src/pages/LeaderboardPage.jsx
import React from "react";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div style={styles.container}>
      <Leaderboard />
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
};
