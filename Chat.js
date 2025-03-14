import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";

function Chat() {
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, "chats");
    const q = query(messagesRef, where("bookingId", "==", bookingId), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [bookingId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const user = auth.currentUser;

    await addDoc(collection(db, "chats"), {
      bookingId,
      senderId: user.uid,
      message: newMessage,
      timestamp: Timestamp.now(),
    });

    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chat</h2>
      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.senderId === auth.currentUser.uid ? "flex-end" : "flex-start",
              backgroundColor: msg.senderId === auth.currentUser.uid ? "#38BDF8" : "#22C55E",
            }}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputBox}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "auto",
    textAlign: "center",
  },
  header: {
    fontSize: "22px",
    color: "#38BDF8",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    height: "300px",
    overflowY: "scroll",
    padding: "10px",
    border: "1px solid #93C5FD",
    borderRadius: "5px",
    backgroundColor: "#1E293B",
  },
  message: {
    padding: "10px",
    borderRadius: "5px",
    color: "white",
    marginBottom: "5px",
    maxWidth: "70%",
  },
  inputBox: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #93C5FD",
    backgroundColor: "#1E293B",
    color: "#E2E8F0",
  },
  sendButton: {
    backgroundColor: "#22D3EE",
    color: "#1E293B",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
  },
};

export default Chat;
