// src/components/ChatBox.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ChatBox({ projectId, session }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages for this project
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) console.log("Error fetching messages:", error);
      else setMessages(data);
    };
    fetchMessages();
  }, [projectId]);

  const sendMessage = async () => {
    if (!newMessage) return;
    // Add user message
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          project_id: projectId,
          user_id: session.user.id,
          text: newMessage,
          role: "user",
        },
      ])
      .select();
    if (error) console.log("Error sending message:", error);
    else {
      const userMsg = data[0];
      setMessages([...messages, userMsg]);
      setNewMessage("");

      // Dummy agent response
      const { data: agentData, error: agentError } = await supabase
        .from("messages")
        .insert([
          {
            project_id: projectId,
            user_id: session.user.id,
            text: "Hello! I am your agent.",
            role: "agent",
          },
        ])
        .select();
      if (agentError) console.log(agentError);
      else setMessages((prev) => [...prev, agentData[0]]);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", maxWidth: "500px" }}
    >
      <div style={{ minHeight: "150px", marginBottom: "1rem" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{ textAlign: m.role === "user" ? "right" : "left" }}
          >
            <span
              style={{
                display: "inline-block",
                background: m.role === "user" ? "#d1e7dd" : "#f8d7da",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                marginBottom: "0.3rem",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} style={{ marginLeft: "0.5rem" }}>
        Send
      </button>
    </div>
  );
}
