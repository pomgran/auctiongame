// src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { db, collection, onSnapshot, query, orderBy } from "../firebase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Listen to all users sorted by coins desc
    const q = query(collection(db, "users"), orderBy("coins", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const userList = [];
      snapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(userList);
    });
    return () => unsub();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Leaderboard (By Coins)</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Coins</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    margin: "20px auto",
    padding: "20px",
    width: "90%",
    maxWidth: "400px",
    background: "var(--box-bg)",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
