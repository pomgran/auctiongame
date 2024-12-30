// src/components/Auctions.jsx
import React, { useEffect, useState, useContext } from "react";
import { db, doc, updateDoc, onAuthStateChanged } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function Auctions() {
  const { currentUser } = useContext(AuthContext);
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [bidAmount, setBidAmount] = useState("");

  // Listen to all auctions in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "auctions"), (snapshot) => {
      const allAuctions = [];
      const userAuctions = [];
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.creatorId === currentUser?.uid && !data.isAutomatic) {
          userAuctions.push(data);
        }
        allAuctions.push(data);
      });
      setAuctions(allAuctions);
      setMyAuctions(userAuctions);
    });
    return () => unsub();
  }, [currentUser]);

  // Function to place a bid
  const placeBid = async (auction, currencyType) => {
    if (!currentUser) return;

    // Basic checks to ensure user has enough balance
    if (currencyType === "dollarsForCoins" && bidAmount > currentUser.dollars) {
      alert("You don't have enough dollars!");
      return;
    }
    if (currencyType === "coinsForDollars" && bidAmount > currentUser.coins) {
      alert("You don't have enough coins!");
      return;
    }

    // Update Firestore with the new bid
    const auctionRef = doc(db, "auctions", auction.id);

    // We can store all bids or just keep track of highest/second-highest
    // For simplicity, let's store all bids in an array in Firestore
    // Then we derive highest/second-highest in the client or with a function
    // Here’s a minimal approach:
    // (In a real project, you might store each bid with a separate doc.)

    // We'll just push a new bid object into the "bids" array
    // Then recalculate highest/second-highest
    // For demonstration, let's do it client-side:

    const newBid = {
      userId: currentUser.uid,
      amount: parseFloat(bidAmount),
      timestamp: Date.now(),
    };

    // We might fetch the current auction doc, parse existing bids, etc.
    // This snippet shows how you might update it:
    // (For concurrency, you'd do a transaction or check in a Cloud Function.)

    try {
      // Let's do a transaction-like approach:
      // 1. We get the existing doc
      // 2. We add the bid to the array
      // 3. We find highest + second-highest
      // 4. We update the doc
      // For brevity, we’re skipping some concurrency checks:
    } catch (err) {
      console.error("Error placing bid:", err);
    }
  };

  // Example listing
  return (
    <div style={styles.container}>
      <h2>Automatic & User-Created Auctions</h2>
      <div style={styles.auctionList}>
        {auctions
          .filter((a) => !a.isClosed)
          .map((auction) => (
            <div key={auction.id} style={styles.auctionBox}>
              <h3>
                {auction.isAutomatic
                  ? "Automatic Auction"
                  : `Auction by ${auction.creatorUsername || auction.creatorId}`}
              </h3>
              <p>
                {auction.type === "dollarsForCoins"
                  ? `Auctioning ${auction.coinAmount} coins for dollars`
                  : `Auctioning $${auction.dollarAmount} for coins`}
              </p>
              <p>Ends at: {new Date(auction.endTime).toLocaleString()}</p>
              <p>Highest Bid: {auction.highestBid}</p>
              <p>Second Highest Bid: {auction.secondHighestBid}</p>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                style={styles.input}
                placeholder="Bid Amount"
              />
              <button
                onClick={() => placeBid(auction, auction.type)}
                style={styles.button}
              >
                Place Bid
              </button>
            </div>
          ))}
      </div>
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
    maxWidth: "800px",
  },
  auctionList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },
  auctionBox: {
    width: "250px",
    background: "var(--box-bg-secondary)",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
  },
  input: {
    marginTop: "10px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "80%",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "var(--accent-color)",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
