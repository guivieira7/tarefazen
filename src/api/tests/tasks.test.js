import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { __resetMemoryForTests } from "../src/db.js";

const app = createApp();

describe("API de tarefas do TarefaZen", () => {
  beforeEach(() => {
    __resetMemoryForTests();
  });

  it("GET /health retorna status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("lista tarefas vazia inicialmente", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("cria e lista uma tarefa", async () => {
    const create = await request(app)
      .post("/api/tasks")
      .send({ title: "Escrever PGCS", description: "Finalizar plano" });
    expect(create.status).toBe(201);
    expect(create.body.title).toBe("Escrever PGCS");
    expect(create.body.status).toBe("pendente");

    const list = await request(app).get("/api/tasks");
    expect(list.body).toHaveLength(1);
  });

  it("rejeita criação sem título", async () => {
    const res = await request(app).post("/api/tasks").send({});
    expect(res.status).toBe(400);
  });

  it("atualiza o status de uma tarefa", async () => {
    const create = await request(app).post("/api/tasks").send({ title: "Testar API" });
    const update = await request(app)
      .patch(`/api/tasks/${create.body.id}`)
      .send({ status: "concluída" });
    expect(update.status).toBe(200);
    expect(update.body.status).toBe("concluída");
  });

  it("remove uma tarefa", async () => {
    const create = await request(app).post("/api/tasks").send({ title: "Remover depois" });
    const del = await request(app).delete(`/api/tasks/${create.body.id}`);
    expect(del.status).toBe(204);

    const list = await request(app).get("/api/tasks");
    expect(list.body).toHaveLength(0);
  });
});
