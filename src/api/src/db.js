// Camada de dados do TarefaZen.
// Usa PostgreSQL quando DATABASE_URL está definida (staging/produção via docker-compose).
// Cai para um armazenamento em memória quando não há banco configurado,
// o que facilita rodar a API isoladamente (ex.: nos testes de CI).
import pg from "pg";

const { Pool } = pg;

let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

// --- fallback em memória -------------------------------------------------
let memoryTasks = [];
let nextId = 1;

function memList() {
  return [...memoryTasks];
}
function memCreate({ title, description }) {
  const task = {
    id: nextId++,
    title,
    description: description || "",
    status: "pendente",
    created_at: new Date().toISOString(),
  };
  memoryTasks.push(task);
  return task;
}
function memUpdate(id, changes) {
  const idx = memoryTasks.findIndex((t) => t.id === Number(id));
  if (idx === -1) return null;
  memoryTasks[idx] = { ...memoryTasks[idx], ...changes };
  return memoryTasks[idx];
}
function memDelete(id) {
  const before = memoryTasks.length;
  memoryTasks = memoryTasks.filter((t) => t.id !== Number(id));
  return memoryTasks.length < before;
}

// --- API pública (usa Postgres se disponível, senão memória) -------------
export async function listTasks() {
  if (!pool) return memList();
  const { rows } = await pool.query(
    "SELECT id, title, description, status, created_at FROM tasks ORDER BY id"
  );
  return rows;
}

export async function createTask({ title, description }) {
  if (!pool) return memCreate({ title, description });
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description, status)
     VALUES ($1, $2, 'pendente')
     RETURNING id, title, description, status, created_at`,
    [title, description || ""]
  );
  return rows[0];
}

export async function updateTask(id, changes) {
  if (!pool) return memUpdate(id, changes);
  const { rows } = await pool.query(
    `UPDATE tasks SET title = COALESCE($1, title),
                       description = COALESCE($2, description),
                       status = COALESCE($3, status)
     WHERE id = $4
     RETURNING id, title, description, status, created_at`,
    [changes.title, changes.description, changes.status, id]
  );
  return rows[0] || null;
}

export async function deleteTask(id) {
  if (!pool) return memDelete(id);
  const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  return rowCount > 0;
}

// Exportado apenas para os testes resetarem o estado em memória entre casos.
export function __resetMemoryForTests() {
  memoryTasks = [];
  nextId = 1;
}
