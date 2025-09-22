import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import ProjectView from "./ProjectView";

export default function Dashboard({ session }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    if (!session) return;
    fetchProjects();
  }, [session]);

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    setProjects(data || []);
  }

  async function createProject() {
    if (!newProjectName) return;
    await supabase
      .from("projects")
      .insert([{ name: newProjectName, user_id: session.user.id }]);
    setNewProjectName("");
    fetchProjects();
  }

  async function deleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", projectId);
    fetchProjects();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.reload(); // forces session re-check
  }

  if (selectedProject) {
    return (
      <ProjectView
        project={selectedProject}
        session={session}
        goBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
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
      {/* Logout button */}
      <button
        onClick={logout}
        style={{
          alignSelf: "flex-end",
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "black",
        }}
      >
        Dashboard
      </h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
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
          onClick={createProject}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Create Project
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
        {projects.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 1rem",
              border: "1px solid black",
              borderRadius: "6px",
              marginBottom: "0.5rem",
              width: "100%",
              backgroundColor: "#fff",
              color: "black",
            }}
          >
            <span
              onClick={() => setSelectedProject(p)}
              style={{ cursor: "pointer" }}
            >
              {p.name}
            </span>
            <button
              onClick={() => deleteProject(p.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
