// src/components/CreateAuction.jsx
import React, { useState, useContext } from "react";
import { db, collection, addDoc } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export default function CreateAuction() {
  const { currentUser } = useContext(AuthContext);
  const [type, setType] = useState("dollarsForCoins");
  const [amount, setAmount] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleCreate = async () => {
    if (!currentUser) return;

    // Basic checks to ensure user has enough balance
    if (type === "dollarsForCoins" && amount > currentUser.coins) {
      alert("You don't have enough coins to put up for sale!");
      return;
    }
    if (type === "coinsForDollars" && amount > currentUser.dollars) {
      alert("You don't have enough dollars to put up for sale!");
      return;
    }

    // Create auction doc
    try {
      await addDoc(collection(db, "auctions"), {
        isAutomatic: false,
        type,
        creatorId: currentUser.uid,
        creatorUsername: currentUser.username,
        coinAmount: type === "dollarsForCoins" ? amount : 0,
        dollarAmount: type === "coinsForDollars" ? amount : 0,
        bids: [],
        highestBid: 0,
        secondHighestBid: 0,
        isClosed: false,
        endTime: new Date(endTime).getTime(), // store as epoch
      });
      alert("Auction created!");
      setAmount("");
      setEndTime("");
    } catch (err) {
      console.error("Error creating auction:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Create Your Own Auction</h3>
      <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
        <option value="dollarsForCoins">Auction my coins for dollars</option>
        <option value="coinsForDollars">Auction my dollars for coins</option>
      </select>
      <input
        type="number"
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="datetime-local"
        style={styles.input}
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleCreate} style={styles.button}>Create</button>
    </div>
  );
}

const styles = {
  container: {
    margin: "20px auto",
    padding: "20px",
    background: "var(--box-bg)",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  },
  input: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "var(--accent-color)",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
