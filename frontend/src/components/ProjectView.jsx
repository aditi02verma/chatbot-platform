import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ProjectView({ project, session, goBack }) {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");

  useEffect(() => {
    fetchPrompts();
  }, []);

  async function fetchPrompts() {
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true });
    setPrompts(data || []);
  }

  async function addPrompt() {
    if (!newPrompt) return;

    // Add the prompt to database
    await supabase
      .from("prompts")
      .insert([{ text: newPrompt, project_id: project.id }]);

    setNewPrompt("");
    fetchPrompts();

    // Add a dummy OpenAI response after a short delay to simulate API response
    setTimeout(() => {
      setPrompts((prev) => [
        ...prev,
        {
          id: `dummy-${Date.now()}`,
          text: "A response from OpenAI would appear here, but since that is a paid service, this dummy response is sent to you. OpenAI responses can easily be integrated if a paid key is used.",
        },
      ]);
    }, 500);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        color: "black",
        border: "1px solid black",
        borderRadius: "8px",
      }}
    >
      <button
        onClick={goBack}
        style={{
          alignSelf: "flex-start",
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2
        style={{
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "black",
        }}
      >
        {project.name}
      </h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Add a prompt"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "200px",
            border: "1px solid black",
            borderRadius: "6px",
            color: "black",
            backgroundColor: "#fff",
            outline: "none",
            boxShadow: "none",
          }}
        />
        <button
          onClick={addPrompt}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add Prompt
        </button>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {prompts.map((p) => (
          <li
            key={p.id}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid black",
              borderRadius: "6px",
              marginBottom: "0.5rem",
              width: "100%",
              textAlign: "center",
              backgroundColor: "#fff",
              color: "black",
            }}
          >
            {p.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
