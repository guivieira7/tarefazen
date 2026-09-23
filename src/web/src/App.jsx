import { useEffect, useState } from "react";

// Em produção o front é servido pelo Nginx e a API fica em outro host;
// VITE_API_URL é injetada em build/deploy. Em dev local aponta pro localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch {
      setError("Não foi possível conectar à API. Ela está rodando?");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    loadTasks();
  }

  async function toggleStatus(task) {
    const next = task.status === "concluída" ? "pendente" : "concluída";
    await fetch(`${API_URL}/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    loadTasks();
  }

  async function removeTask(id) {
    await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  return (
    <div className="container">
      <h1>TarefaZen</h1>
      <p className="subtitle">Sistema colaborativo de gestão de tarefas</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate} className="task-form">
        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.status === "concluída" ? "done" : ""}>
            <div>
              <strong>{task.title}</strong>
              {task.description && <p>{task.description}</p>}
            </div>
            <div className="actions">
              <button onClick={() => toggleStatus(task)}>
                {task.status === "concluída" ? "Reabrir" : "Concluir"}
              </button>
              <button onClick={() => removeTask(task.id)}>Excluir</button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && !error && <p>Nenhuma tarefa ainda. Adicione uma acima.</p>}
      </ul>
    </div>
  );
}
