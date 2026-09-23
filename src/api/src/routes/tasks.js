import { Router } from "express";
import { listTasks, createTask, updateTask, deleteTask } from "../db.js";

export const tasksRouter = Router();

tasksRouter.get("/", async (_req, res) => {
  const tasks = await listTasks();
  res.json(tasks);
});

tasksRouter.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "O campo 'title' é obrigatório." });
  }
  const task = await createTask({ title, description });
  res.status(201).json(task);
});

tasksRouter.patch("/:id", async (req, res) => {
  const task = await updateTask(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada." });
  res.json(task);
});

tasksRouter.delete("/:id", async (req, res) => {
  const ok = await deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ error: "Tarefa não encontrada." });
  res.status(204).send();
});
